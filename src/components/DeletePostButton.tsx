"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeletePostButtonProps {
    slug: string;
    title: string;
}

export default function DeletePostButton({
    slug,
    title,
}: DeletePostButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDeletePost = async () => {
        if (
            !confirm(
                `"${title}" 포스트를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
            )
        ) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await fetch(`/api/posts/${slug}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("포스트가 성공적으로 삭제되었습니다.");
                router.push("/");
            } else {
                const error = await response.json();
                alert(error.error || "포스트 삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("포스트 삭제 중 오류가 발생했습니다.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDeletePost}
            disabled={isDeleting}
            className={`inline-flex items-center px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                isDeleting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
            }`}
        >
            {isDeleting ? "삭제 중..." : "포스트 삭제"}
        </button>
    );
}
