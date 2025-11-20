//구글 검색엔진에 해당 사이트 및 블로그 정보를 제공하기 위한 구조화된 데이터(schema.org) 생성 함수들
import { Post } from "./posts";

// 개별 블로그 포스팅 스키마 생성 함수(각 포스트별 정보)
export function generateBlogPostingSchema(post: Post, url: string) {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.title,
        author: {
            "@type": "Person",
            name: "WallyLog",
        },
        datePublished: post.date,
        dateModified: post.date,
        url: url,
        keywords: post.category || "",
        articleBody: post.content,
        publisher: {
            "@type": "Organization",
            name: "WallyLog",
        },
    };
}

// 웹사이트 및 블로그 스키마 생성 함수 (사이트 전체 정보)
export function generateWebsiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "WallyLog",
        description: "개발 블로그 및 일상생활 기록을 위한 공간",
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

// 블로그 스키마 생성 함수 (해당 사이트에 블로그가 있음을 명시)
export function generateBlogSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "WallyLog",
        description: "개발 블로그 및 일상생활 기록을 위한 공간",
        url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        author: {
            "@type": "Person",
            name: "WallyLog",
        },
        publisher: {
            "@type": "Organization",
            name: "WallyLog",
        },
    };
}

// 영어 문장 패턴 학습 페이지 스키마 생성 함수
export const englishPatternPageSchema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "English Sentence Pattern Learning",
    description: "영어 문장 패턴을 배우고 연습할 수 있는 학습 페이지",
    url: process.env.NEXT_PUBLIC_SITE_URL
        ? process.env.NEXT_PUBLIC_SITE_URL + "/pattern"
        : "http://localhost:3000/pattern",
    educationalLevel: "Beginner",
    learningResourceType: "Lesson",
    about: {
        "@type": "Thing",
        name: "English Sentence Patterns",
    },
    author: {
        "@type": "Person",
        name: "WallyLog",
    },
    publisher: {
        "@type": "Organization",
        name: "WallyLog",
    },
};
