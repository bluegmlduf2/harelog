import { NextRequest, NextResponse } from "next/server";
import { getPostsPaginated } from "@/lib/posts";

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
