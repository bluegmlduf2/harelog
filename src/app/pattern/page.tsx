"use client";

import { useState, useEffect } from "react";
import PatternList from "@/components/PatternList";
// import { Quiz } from "./components/Quiz";

import {
    PatternsResponse,
    PatternItem,
} from "@/app/api/generate-english/route";

export default function PatternPage() {
    const [data, setData] = useState<PatternItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"patterns" | "quiz">("patterns");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/generate-english");
                if (!response.ok) {
                    throw new Error("데이터를 불러오는데 실패했습니다");
                }
                const jsonData = await response.json();
                const parsed = JSON.parse(jsonData) as PatternsResponse;
                setData(parsed.patterns);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "알 수 없는 에러가 발생했습니다"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    // <div className="container mx-auto px-4 py-8">
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <div className="max-w-md mx-auto px-6 py-8">
                    <h1 className="text-white mb-2 text-2xl">영어 패턴</h1>
                    <p className="text-blue-100">
                        패턴을 학습하고 퀴즈로 실력을 테스트하세요
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-md mx-auto -mt-4">
                {/* Tabs */}
                <div className="px-6 mb-4">
                    <div className="grid grid-cols-2 bg-white shadow-sm rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab("patterns")}
                            className={`py-2.5 rounded-md transition-all ${
                                activeTab === "patterns"
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            패턴 목록
                        </button>
                        <button
                            onClick={() => setActiveTab("quiz")}
                            className={`py-2.5 rounded-md transition-all ${
                                activeTab === "quiz"
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            퀴즈
                        </button>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    {activeTab === "patterns" && data && (
                        <PatternList patterns={data} />
                    )}
                    {/* {activeTab === "quiz" && <Quiz patterns={data ?? []} />} */}
                </div>
            </div>
        </div>
    );
}
