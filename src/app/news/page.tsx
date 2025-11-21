import type { Metadata } from "next";
import NewsContainer from "@/components/NewsContainer";

export const metadata: Metadata = {
    title: "오늘의 IT 뉴스",
    description:
        "AI, 소프트웨어, 빅테크 기업 소식 등 최신 IT 뉴스를 한눈에 확인하세요. 매일 업데이트되는 기술 트렌드 요약 제공.",
    openGraph: {
        title: "오늘의 IT 뉴스",
        description:
            "AI, 소프트웨어, 빅테크 기업 소식 등 최신 IT 뉴스를 한눈에 확인하세요. 기술 트렌드 요약 및 분석 제공.",
        type: "article",
        url: process.env.NEXT_PUBLIC_SITE_URL
            ? process.env.NEXT_PUBLIC_SITE_URL + "/news"
            : "http://localhost:3000/news",
        publishedTime: "2025-11-20T10:00:00Z",
        tags: ["IT 뉴스", "기술 트렌드", "AI", "소프트웨어", "빅테크"],
    },
    twitter: {
        card: "summary_large_image",
        title: "오늘의 IT 뉴스",
        description: "최신 IT 뉴스와 기술 트렌드를 빠르게 요약해 알려드립니다.",
    },
    keywords: [
        "IT 뉴스",
        "기술 뉴스",
        "AI 뉴스",
        "테크 뉴스",
        "소프트웨어 소식",
        "테크 트렌드",
    ],
    alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL
            ? process.env.NEXT_PUBLIC_SITE_URL + "/news"
            : "http://localhost:3000/news",
    },
};

export default function NewsPage() {
    return <NewsContainer />; // 클라이언트 로직 컴포넌트 렌더링
}
