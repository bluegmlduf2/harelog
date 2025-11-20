import type { Metadata } from "next";
import PatternContainer from "@/components/PatternContainer";

export const metadata: Metadata = {
    title: "영어 일상 회화 패턴 학습", // 페이지 제목
    description:
        "초보자를 위한 실생활 영어 패턴 학습 페이지. 다양한 예문과 함께 자연스럽게 영어를 익혀보세요.", // 페이지 설명
    openGraph: {
        title: "영어 일상 회화 패턴 학습",
        description:
            "초보자를 위한 실생활 영어 패턴 학습 페이지. 다양한 예문과 함께 자연스럽게 영어를 익혀보세요.",
        type: "article",
        url: process.env.NEXT_PUBLIC_SITE_URL
            ? process.env.NEXT_PUBLIC_SITE_URL + "/pattern"
            : "http://localhost:3000/pattern", // 실제 페이지 URL
        publishedTime: "2025-11-20T10:00:00Z",
        tags: ["영어학습", "영어회화", "패턴"],
    },
    twitter: {
        card: "summary_large_image",
        title: "영어 일상 회화 패턴 학습",
        description:
            "초보자를 위한 실생활 영어 패턴 학습 페이지. 다양한 예문과 함께 자연스럽게 영어를 익혀보세요.",
    },
    keywords: ["영어학습", "영어회화", "패턴", "초보영어"],
    alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL
            ? process.env.NEXT_PUBLIC_SITE_URL + "/pattern"
            : "http://localhost:3000/pattern",
    },
};

export default function PatternPage() {
    return <PatternContainer />; // 클라이언트 로직 컴포넌트 렌더링
}
