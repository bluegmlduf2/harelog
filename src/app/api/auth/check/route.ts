import { NextRequest, NextResponse } from "next/server";
import { verifyToken, isTokenBlacklisted } from "../../../../lib/jwt";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // 블랙리스트 확인
    if (isTokenBlacklisted(token)) {
        return NextResponse.json(
            {
                authenticated: false,
                message: "토큰이 무효화되었습니다.",
            },
            { status: 401 }
        );
    }

    // JWT 검증
    const payload = verifyToken(token);

    if (!payload) {
        return NextResponse.json(
            {
                authenticated: false,
                message: "유효하지 않은 토큰입니다.",
            },
            { status: 401 }
        );
    }

    // 사용자 타입 확인
    if (payload.type !== "admin" || payload.userId !== "admin") {
        return NextResponse.json(
            {
                authenticated: false,
                message: "권한이 없습니다.",
            },
            { status: 403 }
        );
    }

    return NextResponse.json({
        authenticated: true,
        user: {
            id: payload.userId,
            type: payload.type,
        },
    });
}
