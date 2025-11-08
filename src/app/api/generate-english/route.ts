import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Authorization 헤더 확인
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Authorization header is missing or invalid" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        // 토큰 검증
        if (token !== process.env.DAILY_API_TOKEN) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 403 }
            );
        }

        // 여기에 실제 작업 로직 구현
        // 예: 데이터베이스 업데이트, 외부 API 호출 등
        const result = {
            status: "success",
            message: "Daily task completed successfully",
            timestamp: new Date().toISOString(),
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
