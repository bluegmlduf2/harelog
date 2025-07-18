import { NextRequest, NextResponse } from "next/server";
import { getPostsPaginated } from "@/lib/posts";
import { isAuthenticated } from "@/lib/auth";
import { uploadMarkdownPost } from "@/lib/github";
import fs from "fs";
import path from "path";

const postsDirectory = path.join(process.cwd(), "posts");

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category") || undefined;

    try {
        const result = getPostsPaginated(page, limit, category);
        return NextResponse.json(result);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    // 인증 확인
    if (!isAuthenticated(request)) {
        return NextResponse.json(
            { message: "인증이 필요합니다." },
            { status: 401 }
        );
    }

    try {
        const { title, category, content } = await request.json();

        // 유효성 검사
        if (!title || !category || !content) {
            return NextResponse.json(
                { message: "제목, 카테고리, 내용은 필수입니다." },
                { status: 400 }
            );
        }

        // 다음 포스트 번호 찾기
        const existingFiles = fs.readdirSync(postsDirectory);
        const postNumbers = existingFiles
            .filter((file) => file.endsWith(".md"))
            .map((file) => {
                const number = parseInt(file.replace(".md", ""), 10);
                return isNaN(number) ? 0 : number;
            })
            .filter((num) => num > 0);

        const nextNumber =
            postNumbers.length > 0 ? Math.max(...postNumbers) + 1 : 1;
        const slug = nextNumber.toString();

        // GitHub Storage 설정 확인
        if (process.env.USE_GITHUB_STORAGE !== "true") {
            return NextResponse.json(
                { message: "포스트 저장이 비활성화되어 있습니다." },
                { status: 403 }
            );
        }

        // GitHub API를 통한 파일 저장
        try {
            const result = await uploadMarkdownPost({
                slug,
                title,
                category,
                content,
            });

            return NextResponse.json(
                {
                    message: "포스트가 성공적으로 저장되었습니다.",
                    filename: result.filename,
                    postNumber: nextNumber,
                    url: result.url,
                },
                { status: 201 }
            );
        } catch (error) {
            console.error("GitHub API 작업 실패:", error);
            return NextResponse.json(
                {
                    message:
                        error instanceof Error
                            ? error.message
                            : "포스트 저장 중 GitHub API 오류가 발생했습니다.",
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error saving post:", error);
        return NextResponse.json(
            { message: "포스트 저장 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
