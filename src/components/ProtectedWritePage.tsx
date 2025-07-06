"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WriteForm from "./WriteForm";
import Header from "./Header";

export default function ProtectedWritePage() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/check");
                if (response.ok) {
                    setIsAuthenticated(true);
                    // 인증 성공시 카테고리를 API에서 가져오기
                    const categoriesResponse = await fetch("/api/categories");
                    if (categoriesResponse.ok) {
                        const data = await categoriesResponse.json();
                        setCategories(data.categories);
                    }
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Auth check error:", error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // 로딩 중
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">인증 확인 중...</p>
                </div>
            </div>
        );
    }

    // 인증되지 않은 경우
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-md mx-auto px-4 py-16">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            접근 권한이 없습니다
                        </h1>
                        <p className="text-gray-600 mb-6">
                            이 페이지에 접근하려면 로그인이 필요합니다.
                        </p>
                        <button
                            onClick={() => router.push("/login")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
                        >
                            로그인하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 인증된 경우
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto lg:px-4 lg:py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            새 포스트 작성
                        </h1>
                    </div>
                    <WriteForm categories={categories} />
                </div>
            </div>
        </div>
    );
}
