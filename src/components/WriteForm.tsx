"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import TurndownService from "turndown";

// Tiptap 에디터를 동적으로 로드 (SSR 방지)
const TiptapEditor = dynamic(() => import("./TiptapEditor"), {
    ssr: false,
    loading: () => (
        <div className="min-h-[300px] bg-gray-100 rounded animate-pulse" />
    ),
}) as React.ComponentType<{
    content: string;
    onChange: (content: string) => void;
    onImageUpload?: (file: File) => Promise<string>;
}>;

interface WriteFormProps {
    categories: string[];
}

export default function WriteForm({ categories }: WriteFormProps) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [customCategory, setCustomCategory] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [showPreview, setShowPreview] = useState(false);
    const [showDeleteSection, setShowDeleteSection] = useState(false);
    const [deleteSlug, setDeleteSlug] = useState("");

    // 로컬 스토리지에서 임시 저장된 내용 불러오기
    useEffect(() => {
        const savedDraft = localStorage.getItem("harelog-draft");
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                if (confirm("저장된 임시 초안이 있습니다. 불러오시겠습니까?")) {
                    setTitle(draft.title || "");
                    setCategory(draft.category || "");
                    setCustomCategory(draft.customCategory || "");
                    setContent(draft.content || "");
                } else {
                    localStorage.removeItem("harelog-draft");
                }
            } catch (error) {
                console.error("Error loading draft:", error);
                localStorage.removeItem("harelog-draft");
            }
        }
    }, []);

    // 내용 변경시 자동으로 임시 저장
    useEffect(() => {
        if (title || content || category) {
            const draft = {
                title,
                category,
                customCategory,
                content,
                lastSaved: new Date().toISOString(),
            };
            localStorage.setItem("harelog-draft", JSON.stringify(draft));
        }
    }, [title, category, customCategory, content]);

    // 이미지 업로드 함수
    const handleImageUpload = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("이미지 업로드에 실패했습니다.");
            }

            const result = await response.json();
            return result.url; // 업로드된 이미지의 URL 반환
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    };

    // 게시글 삭제 함수
    const handleDeletePost = async () => {
        if (!deleteSlug.trim()) {
            setMessage({
                type: "error",
                text: "삭제할 포스트의 슬러그를 입력해주세요.",
            });
            return;
        }

        if (
            !confirm(
                `"${deleteSlug}" 포스트를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
            )
        ) {
            return;
        }

        setIsDeleting(true);
        setMessage({ type: "", text: "" });

        try {
            const response = await fetch(`/api/posts/${deleteSlug}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setMessage({
                    type: "success",
                    text: `"${deleteSlug}" 포스트가 성공적으로 삭제되었습니다.`,
                });
                setDeleteSlug(""); // 입력 필드 초기화
                window.scrollTo({ top: 0, behavior: "smooth" });

                // 3초 후 성공 메시지 자동 제거
                setTimeout(() => {
                    setMessage({ type: "", text: "" });
                }, 3000);
            } else {
                const error = await response.json();
                setMessage({
                    type: "error",
                    text: error.error || "포스트 삭제에 실패했습니다.",
                });
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            setMessage({
                type: "error",
                text: "포스트 삭제 중 오류가 발생했습니다.",
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const finalCategory =
            category === "new" ? customCategory.trim() : category;

        if (!title.trim() || !finalCategory || !content.trim()) {
            setMessage({ type: "error", text: "모든 필드를 채워주세요." });
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // 저장 확인
        if (!confirm(`"${title}"를 저장하시겠습니까?`)) {
            return;
        }

        setIsLoading(true);
        setMessage({ type: "", text: "" });

        try {
            // HTML을 마크다운으로 변환
            const turndownService = new TurndownService({
                headingStyle: "atx",
                bulletListMarker: "-",
                codeBlockStyle: "fenced",
            });

            const markdown = turndownService.turndown(content);

            // 서버로 데이터 전송
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title.trim(),
                    category: finalCategory,
                    content: markdown,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setMessage({
                    type: "success",
                    text: `포스트가 성공적으로 저장되었습니다! 파일: ${result.filename}`,
                });
                // 폼 리셋
                setTitle("");
                setCategory("");
                setCustomCategory("");
                setContent("");

                // 임시 저장된 내용 삭제
                localStorage.removeItem("harelog-draft");

                // 3초 후 성공 메시지 자동 제거
                setTimeout(() => {
                    setMessage({ type: "", text: "" });
                }, 3000);
            } else {
                const error = await response.json();
                setMessage({
                    type: "error",
                    text: error.message || "포스트 저장에 실패했습니다.",
                });
            }
        } catch (error) {
            console.error("Error saving post:", error);
            setMessage({
                type: "error",
                text: "포스트 저장 중 오류가 발생했습니다.",
            });
        } finally {
            // 페이지 상단으로 스크롤
            window.scrollTo({ top: 0, behavior: "smooth" });
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 메시지 표시 */}
            {message.text && (
                <div
                    className={`p-4 rounded-md ${
                        message.type === "success"
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                >
                    {message.text}
                </div>
            )}

            <div>
                <div className="md:grid grid-cols-6 gap-4 mb-6">
                    <div className="col-span-4 max-md:mb-6">
                        {/* 제목 입력 */}
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            제목
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="포스트 제목을 입력하세요"
                            required
                        />
                    </div>

                    {/* 카테고리 선택 */}
                    <div className="col-span-2">
                        <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            카테고리
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full h-[42px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">카테고리를 선택하세요</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                            <option value="new">새 카테고리 추가</option>
                        </select>
                    </div>

                    <div className="col-span-2 col-end-7">
                        {/* 새 카테고리 입력 */}
                        {category === "new" && (
                            <input
                                type="text"
                                value={customCategory}
                                onChange={(e) =>
                                    setCustomCategory(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                                placeholder="새 카테고리 이름을 입력하세요"
                                required
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* 내용 입력 (Tiptap 에디터) */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        내용
                    </label>
                </div>

                {showPreview ? (
                    <div className="border border-gray-300 rounded-md p-4 min-h-[300px] bg-gray-50">
                        <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                                __html:
                                    content ||
                                    "<p class='text-gray-500'>작성된 내용이 없습니다.</p>",
                            }}
                        />
                    </div>
                ) : (
                    <div className="border border-gray-300 rounded-md overflow-hidden">
                        <TiptapEditor
                            content={content}
                            onChange={setContent}
                            onImageUpload={handleImageUpload}
                        />
                    </div>
                )}
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-end items-center space-x-4">
                <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                    {showPreview ? "에디터 보기" : "미리보기"}
                </button>
                <button
                    type="button"
                    onClick={() => setShowDeleteSection(!showDeleteSection)}
                    className="px-6 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                    게시글 삭제
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-2 rounded-md font-medium ${
                        isLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    } text-white transition-colors`}
                >
                    {isLoading ? "저장 중..." : "포스트 저장"}
                </button>
            </div>

            {/* 게시글 삭제 섹션 */}
            {showDeleteSection && (
                <div className="border border-red-200 rounded-md p-4 bg-red-50">
                    <h3 className="text-lg font-semibold text-red-800 mb-4">
                        게시글 삭제
                    </h3>
                    <p className="text-red-700 mb-4">
                        삭제하려는 게시글의 슬러그(파일명)를 입력하세요. 이
                        작업은 되돌릴 수 없습니다.
                    </p>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={deleteSlug}
                            onChange={(e) => setDeleteSlug(e.target.value)}
                            placeholder="예: my-post-title"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={handleDeletePost}
                            disabled={isDeleting || !deleteSlug.trim()}
                            className={`px-4 py-2 text-sm rounded ${
                                isDeleting || !deleteSlug.trim()
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-700"
                            } text-white transition-colors`}
                        >
                            {isDeleting ? "삭제 중..." : "삭제"}
                        </button>
                    </div>

                    <div className="mt-3 text-sm text-red-600">
                        <p>
                            💡 <strong>슬러그 확인 방법:</strong>
                        </p>
                        <p>
                            • 블로그 URL에서 마지막 부분: /posts/
                            <strong>슬러그</strong>
                        </p>
                        <p>• 또는 posts 폴더의 파일명에서 .md를 제외한 부분</p>
                    </div>
                </div>
            )}
        </form>
    );
}
