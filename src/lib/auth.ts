import { NextRequest } from "next/server";
import { verifyToken, isTokenBlacklisted } from "./jwt";

export function isAuthenticated(request: NextRequest): boolean {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
        return false;
    }

    // 블랙리스트 확인
    if (isTokenBlacklisted(token)) {
        return false;
    }

    // JWT 검증
    const payload = verifyToken(token);

    if (!payload) {
        return false;
    }

    // 사용자 타입 및 ID 확인
    if (payload.type !== "admin" || payload.userId !== "admin") {
        return false;
    }

    return true;
}
