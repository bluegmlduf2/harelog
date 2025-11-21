"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import NewsCard from "./NewsCard";
import { NewsResponse, Language } from "@/app/api/generate-news/route";

export default function NewsContainer() {
    const [language, setLanguage] = useState<Language>("ko");
    const [data, setData] = useState<NewsResponse | null>(null);
    const [displayedDates, setDisplayedDates] = useState<string[]>([]);
    const [allDates, setAllDates] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            // 스크롤이 하단 근처에 도달했는지 확인
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            if (scrollTop + windowHeight >= documentHeight - 200 && !loading) {
                loadMoreDates();
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [displayedDates, allDates, loading]);

    const fetchData = async (date?: string) => {
        try {
            setLoading(true);

            const response = await fetch(
                date ? `/api/generate-news?date=${date}` : `/api/generate-news`
            );
            if (!response.ok) {
                throw new Error("데이터를 불러오는데 실패했습니다");
            }

            const jsonData = (await response.json()) as NewsResponse & {
                allDates: string[];
            }; // allDates 임시적으로 추가

            setData(jsonData);
            setAllDates(jsonData.allDates);
            setDisplayedDates([jsonData.date]);
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

    const loadMoreDates = () => {
        if (displayedDates.length >= allDates.length) return;

        setLoading(true);
        // 다음 날짜 추가
        setTimeout(() => {
            const nextDate = allDates[displayedDates.length];
            if (nextDate) {
                setDisplayedDates([...displayedDates, nextDate]);
            }
            setLoading(false);
        }, 300);
    };

    const formatDate = (dateString: string) => {
        const year = parseInt(dateString.slice(0, 4), 10);
        const month = parseInt(dateString.slice(4, 6), 10) - 1; // JS 월은 0~11
        const day = parseInt(dateString.slice(6, 8), 10);
        const date: Date = new Date(year, month, day);

        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const languages: { value: Language; label: string }[] = [
        { value: "original", label: "Original" },
        { value: "ko", label: "한국어" },
        { value: "ja", label: "日本語" },
        { value: "en", label: "English" },
    ];

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        {/* Language Toggle */}
                        <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200">
                            <Globe className="w-4 h-4 text-gray-600" />
                            <div className="flex gap-1">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.value}
                                        onClick={() => setLanguage(lang.value)}
                                        className={`px-3 py-1 rounded-full transition-all ${
                                            language === lang.value
                                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span>Today&apos;s IT Tech News</span>
                    </div>
                </div>

                {/* News by Date */}
                {displayedDates.map((dateString, dateIndex) => {
                    if (!data) return null;

                    const isFirstOld = dateIndex === 1;

                    return (
                        <div key={dateString}>
                            {/* Show "지난 뉴스" header only once for the first old news */}
                            {isFirstOld && (
                                <div className="mb-12 mt-16">
                                    <h3 className="text-gray-900 text-center">
                                        지난 뉴스
                                    </h3>
                                    <div className="h-1 w-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full mt-2 mx-auto" />
                                </div>
                            )}

                            <div className="mb-16">
                                {/* Date Header */}
                                <div className="mb-6">
                                    <h3 className="text-gray-900">
                                        {formatDate(dateString)}
                                    </h3>
                                    <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
                                </div>

                                {/* News Cards Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {data.sources.map((news, index) => (
                                        <NewsCard
                                            key={`${dateString}-${news.id}`}
                                            news={news}
                                            language={language}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
                    </div>
                )}

                {/* End Message */}
                {displayedDates.length >= allDates.length && (
                    <div className="text-center py-8 text-gray-600">
                        <p>No more news to load</p>
                    </div>
                )}
            </main>
        </div>
    );
}
