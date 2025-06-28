import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { generateWebsiteSchema, generateBlogSchema } from "@/lib/seo";
import type { Metadata } from "next";
import { formatKoreanDate } from "@/lib/date";

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
    const posts = getAllPosts();
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
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    HareLog
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    개발 블로그 및 일상생활 기록을 위한 공간
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Posts */}
                        <div className="lg:col-span-2">
                            <div className="space-y-8">
                                {posts.map((post) => (
                                    <article
                                        key={post.slug}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                                <time dateTime={post.date}>
                                                    {formatKoreanDate(
                                                        post.date
                                                    )}
                                                </time>
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                                <Link
                                                    href={`/posts/${post.slug}`}
                                                    className="hover:text-blue-600 transition-colors"
                                                >
                                                    {post.title}
                                                </Link>
                                            </h2>
                                            {post.category && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                        {post.category}
                                                    </span>
                                                </div>
                                            )}
                                            <Link
                                                href={`/posts/${post.slug}`}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                더보기
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* About */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    About
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    I am working as a programmer in Japan <br />
                                    I mainly use the languages and frameworks
                                    listed below, and I have a keen interest in
                                    them <br />
                                    And this web page is built with Next.js 😀{" "}
                                    <br />
                                    <br />
                                    - JAVASCRIPT
                                    <br />
                                    - VUEJS <br />
                                    - PHP <br />
                                    - LARAVEL <br />
                                    - PYTHON <br />
                                    - FLASK
                                    <br />
                                </p>
                            </div>

                            {/* Recent Posts */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    Recent Posts
                                </h3>
                                <div className="space-y-3">
                                    {posts.slice(0, 5).map((post) => (
                                        <div key={post.slug}>
                                            <Link
                                                href={`/posts/${post.slug}`}
                                                className="text-sm text-gray-700 hover:text-blue-600 transition-colors line-clamp-2"
                                            >
                                                {post.title}
                                            </Link>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatKoreanDate(post.date)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
