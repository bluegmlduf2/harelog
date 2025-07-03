import { NextResponse } from "next/server";
import { getAllCategories } from "@/lib/posts";

export async function GET() {
    try {
        const categories = getAllCategories();
        return NextResponse.json({ categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}
