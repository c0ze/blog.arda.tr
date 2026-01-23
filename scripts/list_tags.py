import glob
import re

files = glob.glob('content/blog/*.md')
all_tags = set()

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            match = re.search(r'^tags:\s*\[(.*?)\]', content, re.MULTILINE)
            if match:
                tags = match.group(1).replace('"', '').replace("'", "").split(',')
                for t in tags:
                    t = t.strip()
                    if t:
                        all_tags.add(t)
    except Exception as e:
        print(f"Error reading {f}: {e}")

print("FOUND TAGS:")
for t in sorted(list(all_tags)):
    print(f"- {t}")
