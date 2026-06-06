
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";
import { spawnSync } from "node:child_process";
import dotenv from "dotenv";
import matter from "gray-matter";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const OUTPUT_DIR = "public/images/og";

// Run ImageMagick's `magick` CLI (replaces the previous sharp pipeline so the
// project relies on a single image tool — see src/magick-service.ts).
function runMagick(args) {
    const result = spawnSync("magick", args, { maxBuffer: 1024 * 1024 * 100 });
    if (result.error) throw result.error;
    if (result.status !== 0) {
        throw new Error(`magick exited with code ${result.status}: ${result.stderr?.toString() ?? ""}`);
    }
}

if (!API_KEY) {
    console.error("Error: GEMINI_API_KEY not found in .env");
    process.exit(1);
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY);
const imageModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });
const textModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function run() {
    const args = process.argv.slice(2);
    let filePath;
    let logoPath;
    let customPrompt;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--logo') {
            logoPath = args[++i];
        } else if (args[i] === '--prompt') {
            customPrompt = args[++i];
        } else if (!args[i].startsWith('--')) {
            filePath = args[i];
        }
    }

    if (!filePath) {
        console.error("Usage: node scripts/generate-og.mjs <path-to-blog-post.md> [--logo <logo-path>] [--prompt <custom-prompt>]");
        process.exit(1);
    }

    try {
        const absolutePath = path.resolve(filePath);
        const fileContent = await fs.readFile(absolutePath, "utf-8");
        const { data: frontmatter, content } = matter(fileContent);
        const slug = path.basename(filePath, ".md");
        const outputPath = path.join(OUTPUT_DIR, `${slug}.png`);

        console.log(`Processing: ${filePath}`);

        let synthesizedPrompt;

        if (customPrompt) {
            synthesizedPrompt = customPrompt;
            console.log(`Using custom prompt: ${synthesizedPrompt}`);
        } else {
            // 1. Synthesize Prompt
            console.log("Synthesizing image prompt...");
            const promptContext = `
          Title: ${frontmatter.title}
          Description: ${frontmatter.description || ""}
          Excerpt: ${frontmatter.excerpt || ""}
          Keywords: ${frontmatter.keywords || ""}
          Content Snippet: ${content.substring(0, 1000)}
        `;

            let styleInstruction = "The image should be modern, tech-focused, and representative of the topic.";
            if (
                (frontmatter.title && frontmatter.title.toLowerCase().includes("fablecast")) ||
                (frontmatter.keywords && frontmatter.keywords.toLowerCase().includes("fablecast"))
            ) {
                styleInstruction = "The image must be in a whimsical children's book illustration style. Use warm pastel colors, soft lighting, and a magical atmosphere. Think: 'Fablecast' aesthetic - deep purple cosmos, warm moonbeam cream, golden starlight highlights. Do NOT make it look cyberpunk or high-tech.";
            }

            const promptResponse = await textModel.generateContent(`
          Based on the following blog post metadata and content, create a short, descriptive, and visually appealing image generation prompt for an Open Graph (OG) image. 
          ${styleInstruction}
          DO NOT include "nano banana style" or similar descriptors. Just the visual description.
          
          Post Data:
          ${promptContext}
        `);

            synthesizedPrompt = promptResponse.response.text().trim();
            console.log(`Generated Prompt: ${synthesizedPrompt}`);
        }

        // 2. Generate Image
        console.log("Generating image...");
        const result = await imageModel.generateContent(synthesizedPrompt);
        const response = await result.response;
        const candidates = response.candidates;
        const imagePart = candidates?.[0]?.content?.parts?.find(p => p.inlineData || p.fileData);

        if (!imagePart || !imagePart.inlineData) {
            console.error("Failed to generate image: No image data in response.");
            process.exit(1);
        }

        const buffer = Buffer.from(imagePart.inlineData.data, "base64");
        const tempPath = path.join(OUTPUT_DIR, `temp_${slug}.png`);
        await fs.mkdir(OUTPUT_DIR, { recursive: true });
        await fs.writeFile(tempPath, buffer);

        // 3. Optimize & compose with ImageMagick
        console.log("Optimizing image...");

        // Resize onto a 1200x630 OG canvas, cropping to fill (cover).
        const magickArgs = [tempPath, "-resize", "1200x630^", "-gravity", "center", "-extent", "1200x630"];

        if (logoPath) {
            const resolvedLogoPath = path.resolve(logoPath);
            try {
                await fs.access(resolvedLogoPath);
                console.log(`Compositing logo from: ${resolvedLogoPath}`);
                // Resize the logo to fit inside 500x500, then composite it centered.
                magickArgs.push("(", resolvedLogoPath, "-resize", "500x500", ")", "-gravity", "center", "-composite");
            } catch (err) {
                console.warn(`Warning: Logo file not found at ${resolvedLogoPath}, skipping composition.`);
            }
        }

        magickArgs.push("-define", "png:compression-level=9", "-strip", outputPath);
        runMagick(magickArgs);

        await fs.unlink(tempPath);
        console.log(`Image saved to: ${outputPath}`);

        // 4. Update Frontmatter
        console.log("Updating frontmatter...");
        // Use forward slashes for URL path
        frontmatter.image = `/images/og/${slug}.png`;
        const newContent = matter.stringify(content, frontmatter);
        await fs.writeFile(absolutePath, newContent);

        console.log("Successfully updated blog post frontmatter.");
        console.log("Done!");

    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
}

run();
