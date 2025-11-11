"use client";

import { useState, useEffect } from "react";
import PatternList from "@/components/PatternList";
// import { Quiz } from "./components/Quiz";
import { Calendar } from "lucide-react";

import { PatternsResponse } from "@/app/api/generate-english/route";

export default function PatternPage() {
    const [data, setData] = useState<PatternsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"patterns" | "quiz">("patterns");
    const [selectedDay, setSelectedDay] = useState<number>(1);
    const [availableDays, setAvailableDays] = useState<number>(1);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (day?: number) => {
        try {
            setLoading(true);

            const response = await fetch(
                day
                    ? `/api/generate-english?day=${day}`
                    : `/api/generate-english`
            );
            if (!response.ok) {
                throw new Error("데이터를 불러오는데 실패했습니다");
            }

            const jsonData = (await response.json()) as PatternsResponse & {
                totalCount: number;
            }; // totalCount 임시적으로 추가

            setData(jsonData); // 전체 데이터 설정
            setSelectedDay(jsonData.day); // 기본 선택 일자 설정
            setAvailableDays(jsonData.totalCount); // 최대 일자 설정
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
                <div className="max-w-md mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-white text-2xl font-bold">
                            영어 패턴
                        </h1>
                        <div className="relative">
                            <select
                                value={selectedDay}
                                onChange={(e) =>
                                    fetchData(Number(e.target.value))
                                }
                                className="appearance-none bg-white/20 !text-white border border-white/30 rounded-lg px-4 py-2 pr-10 cursor-pointer hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
                            >
                                {[...Array(availableDays)].map((_, index) => (
                                    <option
                                        key={index + 1}
                                        value={index + 1}
                                        className="text-gray-900"
                                    >
                                        Day {index + 1}
                                    </option>
                                ))}
                            </select>
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
                        </div>
                    </div>
                    <p className="text-blue-100">
                        패턴을 학습하고 퀴즈로 실력을 테스트하세요
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-md md:max-w-xl mx-auto -mt-4">
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
                        <PatternList patterns={data.patterns} />
                    )}
                    {/* {activeTab === "quiz" && <Quiz patterns={data ?? []} />} */}
                </div>
            </div>
        </div>
    );
}
