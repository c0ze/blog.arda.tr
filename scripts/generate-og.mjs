
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import sharp from "sharp";
import matter from "gray-matter";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const OUTPUT_DIR = "public/images/og";

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
    const filePath = args[0];

    if (!filePath) {
        console.error("Usage: node scripts/generate-og.mjs <path-to-blog-post.md>");
        process.exit(1);
    }

    try {
        const absolutePath = path.resolve(filePath);
        const fileContent = await fs.readFile(absolutePath, "utf-8");
        const { data: frontmatter, content } = matter(fileContent);
        const slug = path.basename(filePath, ".md");
        const outputPath = path.join(OUTPUT_DIR, `${slug}.png`);

        console.log(`Processing: ${filePath}`);

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

        const synthesizedPrompt = promptResponse.response.text().trim();
        console.log(`Generated Prompt: ${synthesizedPrompt}`);

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
        await fs.writeFile(tempPath, buffer);

        // 3. Optimize with Sharp
        console.log("Optimizing image...");
        await fs.mkdir(OUTPUT_DIR, { recursive: true });
        await sharp(tempPath)
            .resize(1200, 630, { fit: 'cover' })
            .png({ quality: 80, compressionLevel: 8 })
            .toFile(outputPath);

        await fs.unlink(tempPath);
        console.log(`Image saved to: ${outputPath}`);

        // 4. Update Frontmatter
        console.log("Updating frontmatter...");
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
