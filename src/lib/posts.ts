import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export interface Post {
    slug: string;
    title: string;
    date: string;
    category: string;
    content: string;
}

export function getAllPosts(): Post[] {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith(".md"))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, "");
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const matterResult = matter(fileContents);

            return {
                slug,
                title: matterResult.data.title,
                date: matterResult.data.date,
                category: matterResult.data.category || "",
                content: matterResult.content,
            };
        });

    return allPostsData.sort((a, b) => {
        // 날짜 검증 후 정렬
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        // 유효하지 않은 날짜는 가장 오래된 것으로 처리
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;

        return dateA < dateB ? 1 : -1;
    });
}

export function getPostsPaginated(
    page: number = 1,
    limit: number = 10,
    category?: string
): { posts: Post[]; hasMore: boolean; total: number } {
    let allPosts = getAllPosts();

    // 카테고리 필터링
    if (category && category !== "all") {
        allPosts = allPosts.filter((post) => post.category === category);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const posts = allPosts.slice(startIndex, endIndex);
    const hasMore = endIndex < allPosts.length;

    return {
        posts,
        hasMore,
        total: allPosts.length,
    };
}

export function getPostBySlug(slug: string): Post {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
        slug,
        title: matterResult.data.title,
        date: matterResult.data.date,
        category: matterResult.data.category || "",
        content: matterResult.content,
    };
}

export async function markdownToHtml(markdown: string): Promise<string> {
    const result = await remark().use(html).process(markdown);
    return result.toString();
}

export function getAllCategories(): string[] {
    const posts = getAllPosts();
    const categories = posts
        .map((post) => post.category)
        .filter((category) => category !== "");
    return Array.from(new Set(categories));
}

export function getPostsByCategory(category: string): Post[] {
    const posts = getAllPosts();
    return posts.filter((post) => post.category === category);
}
