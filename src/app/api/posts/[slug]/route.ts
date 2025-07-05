import { NextRequest, NextResponse } from "next/server";
import { deleteFileFromGitHub } from "@/lib/github";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params;

        if (!slug) {
            return NextResponse.json(
                { error: "포스트 슬러그가 제공되지 않았습니다." },
                { status: 400 }
            );
        }

        try {
            await deleteFileFromGitHub({
                path: `posts/${slug}.md`,
                message: `포스트 삭제: ${slug}.md`,
            });

            return NextResponse.json({
                success: true,
                message: "포스트가 성공적으로 삭제되었습니다.",
                deletedSlug: slug,
            });
        } catch (error) {
            console.error("포스트 삭제 오류:", error);

            if (error instanceof Error) {
                if (error.message.includes("찾을 수 없습니다")) {
                    return NextResponse.json(
                        { error: "삭제하려는 포스트를 찾을 수 없습니다." },
                        { status: 404 }
                    );
                }
                return NextResponse.json(
                    { error: error.message },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                { error: "포스트 삭제 중 오류가 발생했습니다." },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("포스트 삭제 오류:", error);
        return NextResponse.json(
            { error: "포스트 삭제 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
