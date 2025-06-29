"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const isHomePage = pathname === "/";

    return (
        <header className="bg-white shadow-sm border-b relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                    {isHomePage ? (
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                HareLog
                            </h1>
                            <p className="text-gray-600 mt-1">
                                개발 블로그 및 일상생활 기록을 위한 공간
                            </p>
                        </div>
                    ) : (
                        <Link
                            href="/"
                            className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                            HareLog
                        </Link>
                    )}

                    {/* 햄버거 버튼 */}
                    <button
                        onClick={toggleMenu}
                        className="flex flex-col justify-center items-center w-8 h-8 space-y-1 hover:bg-gray-100 rounded-md transition-colors p-1"
                        aria-label="메뉴 열기"
                    >
                        <div
                            className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
                                isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                            }`}
                        ></div>
                        <div
                            className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
                                isMenuOpen ? "opacity-0" : ""
                            }`}
                        ></div>
                        <div
                            className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
                                isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                            }`}
                        ></div>
                    </button>
                </div>
            </div>

            {/* 드롭다운 메뉴 */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex flex-col space-y-3">
                            <Link
                                href="/"
                                className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                홈
                            </Link>
                        </nav>
                    </div>
                </div>
            )}

            {/* 메뉴가 열렸을 때 배경 클릭으로 닫기 */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}
        </header>
    );
}
