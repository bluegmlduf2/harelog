import { getAllPosts, getPostsPaginated, getAllCategories } from "../lib/posts";
import { generateWebsiteSchema, generateBlogSchema } from "../lib/seo";
import type { Metadata } from "next";
import BlogContainer from "../components/BlogContainer";
import Header from "../components/Header";

export const metadata: Metadata = {
    title: "HareLog",
    description: "개발 블로그 및 일상생활 기록을 위한 공간",
    openGraph: {
        title: "HareLog",
        description: "개발 블로그 및 일상생활 기록을 위한 공간",
        type: "website",
        url: "/",
    },
    twitter: {
        card: "summary_large_image",
        title: "HareLog",
        description: "개발 블로그 및 일상생활 기록을 위한 공간",
    },
};

export default function Home() {
    const allPosts = getAllPosts();
    const { posts: initialPosts, hasMore: initialHasMore } = getPostsPaginated(
        1,
        10
    );
    const categories = getAllCategories();

    // 카테고리별 포스트 수 계산
    const postCounts = categories.reduce((counts, category) => {
        counts[category] = allPosts.filter(
            (post) => post.category === category
        ).length;
        return counts;
    }, {} as Record<string, number>);
    postCounts.all = allPosts.length;

    const websiteSchema = generateWebsiteSchema();
    const blogSchema = generateBlogSchema();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([websiteSchema, blogSchema]),
                }}
            />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <Header />
                {/* Main Content */}
                <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <BlogContainer
                        initialPosts={initialPosts}
                        initialHasMore={initialHasMore}
                        categories={categories}
                        postCounts={postCounts}
                    />
                </main>
            </div>
        </>
    );
}
