import { NextRequest, NextResponse } from "next/server";
import { addTokenToBlacklist } from "../../../../lib/jwt";

export async function POST(request: NextRequest) {
    try {
        // 현재 토큰을 블랙리스트에 추가
        const token = request.cookies.get("auth-token")?.value;
        if (token) {
            addTokenToBlacklist(token);
        }

        const response = NextResponse.json({
            success: true,
            message: "로그아웃 되었습니다.",
        });

        // 쿠키 삭제
        response.cookies.delete("auth-token");

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "로그아웃 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
