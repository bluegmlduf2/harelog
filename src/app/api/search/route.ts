import { NextRequest, NextResponse } from "next/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { getAllPosts } from "@/lib/posts";

// OpenRouter 클라이언트 생성 (API 키 포함)
const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();

        if (!query || query.trim().length === 0) {
            return NextResponse.json(
                { error: "검색어를 입력해주세요." },
                { status: 400 }
            );
        }

        // 모든 포스트 가져오기
        const posts = getAllPosts();

        // 포스트 내용을 AI가 검색할 수 있도록 문자열로 변환
        const postsContext = posts
            .map(
                (post) =>
                    `제목: ${post.title}\n카테고리: ${post.category}\n날짜: ${
                        post.date
                    }\n내용: ${post.content.substring(0, 500)}...\nSlug: ${
                        post.slug
                    }`
            )
            .join("\n\n---\n\n");

        // OpenRouter 전용 프로바이더 사용 (API 키 설정 포함)
        const result = await generateText({
            model: openrouter("google/gemini-2.0-flash-exp:free"),
            prompt: `다음은 블로그의 모든 포스트 정보입니다:

            ${postsContext}

            사용자 검색어: "${query}"

            위의 포스트들 중에서 사용자의 검색어와 가장 관련있는 포스트들을 찾아서 다음 JSON 형식으로 반환해주세요:

            {
            "results": [
                {
                "title": "포스트 제목",
                "slug": "포스트 슬러그",
                "category": "카테고리",
                "date": "날짜",
                "relevance": "관련성 점수 (1-10)",
                "summary": "검색어와 관련된 내용 요약 (2-3줄)"
                }
            ],
            "totalCount": 결과개수
            }

            관련성이 높은 순서대로 최대 3개까지 반환해주세요. 만약 관련된 포스트가 없다면 빈 배열을 반환해주세요.
            반드시 JSON 형식으로만 응답해주세요.`,
            temperature: 0.3,
        });

        // AI 응답을 JSON으로 파싱
        let searchResults;
        try {
            // JSON 부분만 추출 (마크다운 코드 블록이 있을 수 있음)
            const jsonMatch = result.text.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : result.text;
            searchResults = JSON.parse(jsonString);
        } catch (parseError) {
            console.error("AI 응답 파싱 오류:", parseError);
            console.error("AI 응답:", result.text);
            return NextResponse.json(
                { error: "검색 결과를 처리하는 중 오류가 발생했습니다." },
                { status: 500 }
            );
        }

        return NextResponse.json(searchResults);
    } catch (error) {
        console.error("AI 검색 오류:", error);

        // OpenRouter API 에러 처리
        if (error instanceof Error) {
            const errorMessage = error.message;

            // Rate limit 관련 에러 처리
            if (errorMessage.includes("Too Many Requests")) {
                return NextResponse.json(
                    {
                        error: "API 요청 한도를 초과했습니다. 잠시 후 다시 검색해주세요.",
                    },
                    { status: 429 }
                );
            }

            // API 키 관련 에러 처리
            if (
                errorMessage.includes("API key") ||
                errorMessage.includes("Unauthorized")
            ) {
                return NextResponse.json(
                    { error: "API 키를 확인해주세요." },
                    { status: 401 }
                );
            }
        }

        return NextResponse.json(
            {
                error: "검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
            },
            { status: 500 }
        );
    }
}
