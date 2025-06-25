const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const postsDirectory = path.join(process.cwd(), "posts");

function fixMarkdownFiles() {
    const files = fs.readdirSync(postsDirectory);
    const markdownFiles = files.filter((file) => file.endsWith(".md"));

    markdownFiles.forEach((file) => {
        const filePath = path.join(postsDirectory, file);

        try {
            const fileContent = fs.readFileSync(filePath, "utf8");
            const parsed = matter(fileContent);

            // 필수 필드들이 있는지 확인
            if (
                !parsed.data.title ||
                !parsed.data.date ||
                !parsed.data.excerpt
            ) {
                console.log(`Skipping ${file}: missing required fields`);
                return;
            }

            // YAML front matter 수정
            const fixedFrontMatter = {
                title: parsed.data.title,
                date:
                    typeof parsed.data.date === "string"
                        ? parsed.data.date
                        : new Date(parsed.data.date)
                              .toISOString()
                              .split("T")[0],
                excerpt: parsed.data.excerpt
                    ? parsed.data.excerpt.substring(0, 100) +
                      (parsed.data.excerpt.length > 100 ? "..." : "")
                    : "",
                author: parsed.data.author || "HareLog",
                category: parsed.data.category || "기타",
            };

            // 새로운 파일 내용 생성
            const newContent = matter.stringify(content, fixedFrontMatter);

            fs.writeFileSync(filePath, newContent);
            console.log(`Fixed: ${file}`);
        } catch (error) {
            console.error(`Error processing ${file}:`, error.message);
        }
    });
}

fixMarkdownFiles();
