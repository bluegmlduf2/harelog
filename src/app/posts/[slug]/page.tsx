import Link from "next/link";
import { getAllPosts, getPostBySlug, markdownToHtml } from "@/lib/posts";
import { generateBlogPostingSchema } from "@/lib/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({
    params,
}: PostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return {
            title: "포스트를 찾을 수 없습니다",
        };
    }

    const url = `/posts/${slug}`;

    return {
        title: post.title,
        description: post.title,
        openGraph: {
            title: post.title,
            description: post.title,
            type: "article",
            url,
            publishedTime: post.date,
            tags: post.category ? [post.category] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.title,
        },
        keywords: post.category ? [post.category] : [],
        alternates: {
            canonical: url,
        },
    };
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const content = await markdownToHtml(post.content);
    const url = `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }/posts/${slug}`;
    const blogPostSchema = generateBlogPostingSchema(post, url);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(blogPostSchema),
                }}
            />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <Link
                                href="/"
                                className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                            >
                                HareLog
                            </Link>
                            <nav className="text-sm text-gray-600">
                                <Link
                                    href="/"
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    ← 홈으로
                                </Link>
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-6xl mx-auto lg:px-8 max-lg:pb-8 lg:py-8">
                    {/* Article */}
                    <article>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-4 lg:p-8">
                                {/* Article Header */}
                                <header className="mb-8 border-b border-gray-200 pb-6">
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <time
                                            dateTime={post.date}
                                            className="flex items-center"
                                        >
                                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                            {new Date(
                                                post.date
                                            ).toLocaleDateString("ko-KR")}
                                        </time>
                                        {post.category && (
                                            <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                                                {post.category}
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                        {post.title}
                                    </h1>
                                </header>

                                {/* Article Content */}
                                <div
                                    className="prose max-w-none 
                                    prose-headings:text-gray-900 prose-headings:font-bold
                                    prose-h1:text-3xl prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-3 prose-h1:mb-6
                                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-blue-700
                                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-800
                                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                                    prose-strong:text-gray-900 prose-strong:font-semibold
                                    prose-code:text-pink-500 prose-code:bg-pink-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                                    prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-ul:space-y-2 prose-ol:space-y-2
                                    prose-li:text-gray-700
                                    prose-img:rounded-lg prose-img:shadow-md
                                    [&_pre_code]:text-gray-100
                                    [&_pre_code]:bg-gray-900
                                    "
                                    dangerouslySetInnerHTML={{
                                        __html: content,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="mt-8 text-center">
                            <Link
                                href="/"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                            >
                                ← 모든 포스트 보기
                            </Link>
                        </div>
                    </article>
                </main>
            </div>
        </>
    );
}
