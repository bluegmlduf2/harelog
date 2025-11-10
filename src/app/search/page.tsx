"use client";

import { useState } from "react";
import Link from "next/link";
import { formatKoreanDate } from "@/lib/date";

interface SearchResult {
    title: string;
    slug: string;
    category: string;
    date: string;
    relevance: string;
    summary: string;
}

interface SearchResponse {
    results: SearchResult[];
    totalCount: number;
}

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!query.trim()) return;

        setLoading(true);
        setError("");
        setResults([]);

        try {
            const response = await fetch("/api/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 401 || response.status === 500) {
                    throw new Error("검색 요청이 실패했습니다.(401/500)");
                }
                throw new Error(
                    errorData?.message ||
                        errorData?.error ||
                        "알 수 없는 오류가 발생했습니다.(메세지 없음)"
                );
            }

            const data: SearchResponse = await response.json();
            setResults(data.results);
            setSearched(true);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    AI 게시글 검색
                </h1>

                <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="검색어를 입력하세요 (예: 라라벨 배포 방법, 자바스크립트 비동기 처리)"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !query.trim()}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? "검색 중..." : "검색"}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-gray-600">
                            AI가 검색 중입니다...🤖
                        </p>
                    </div>
                )}

                {searched && !loading && (
                    <div className="border-t pt-6">
                        {results.length > 0 ? (
                            <>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    검색 결과 ({results.length}개)
                                </h2>
                                <div className="space-y-4">
                                    {results.map((result, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <Link
                                                    href={`/posts/${result.slug}`}
                                                    className="text-lg font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    {result.title}
                                                </Link>
                                                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    관련도: {result.relevance}
                                                    /10
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                <span className="bg-gray-100 px-2 py-1 rounded">
                                                    {result.category}
                                                </span>
                                                <span>
                                                    {formatKoreanDate(
                                                        result.date
                                                    )}
                                                </span>
                                            </div>

                                            <p className="text-gray-700 leading-relaxed">
                                                {result.summary}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8 text-gray-600">
                                <p className="text-lg">검색 결과가 없습니다.</p>
                                <p className="text-sm mt-2">
                                    다른 검색어로 시도해보세요.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    💡 검색 팁
                </h3>
                <div className="space-y-2 text-gray-700">
                    <p>
                        • 자연어로 질문해보세요: &ldquo;라라벨 배포하는
                        방법&rdquo;
                    </p>
                    <p>
                        • 구체적인 기술 스택을 언급하세요: &ldquo;Next.js
                        SSR&rdquo;
                    </p>
                    <p>
                        • 문제 상황을 설명하세요: &ldquo;CORS 오류 해결&rdquo;
                    </p>
                    <p>• 키워드 조합: &ldquo;Docker nginx 설정&rdquo;</p>
                </div>
            </div>
        </main>
    );
}
