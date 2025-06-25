import { Post } from "./posts";

export function generateBlogPostingSchema(post: Post, url: string) {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.title,
        author: {
            "@type": "Person",
            name: "HareLog",
        },
        datePublished: post.date,
        dateModified: post.date,
        url: url,
        keywords: post.tags ? [post.tags] : [],
        articleBody: post.content,
        publisher: {
            "@type": "Organization",
            name: "HareLog",
        },
    };
}

export function generateWebsiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "HareLog",
        description: "Next.js와 Tailwind CSS로 만든 마크다운 기반 개발 블로그",
        url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${
                    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
                }/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}

export function generateBlogSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "HareLog",
        description: "Next.js와 Tailwind CSS로 만든 마크다운 기반 개발 블로그",
        url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        author: {
            "@type": "Person",
            name: "HareLog",
        },
        publisher: {
            "@type": "Organization",
            name: "HareLog",
        },
    };
}
