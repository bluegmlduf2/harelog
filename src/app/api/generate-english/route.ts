import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { uploadJsonToGitHub } from "@/lib/github";

export interface PatternsResponse {
    patterns: PatternItem[];
}

export interface PatternItem {
    pId: string;
    pattern: string;
    meaning: string;
    examples: Example[];
}

export interface Example {
    eId: string;
    sentence: string;
    translation: string;
}

// OpenRouter 클라이언트 생성 (API 키 포함)
const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

const patternDirectory = path.join(process.cwd(), "public", "pattern");

// 최근 생성된 영어 패턴 파일을 읽어오는 GET 핸들러
export async function GET() {
    try {
        const fileNames = fs.readdirSync(patternDirectory);
        if (fileNames) {
            if (fileNames.length === 0) {
                return NextResponse.json(
                    { error: "No files found in the pattern directory." },
                    { status: 404 }
                );
            }
            const fileName = fileNames.reduce((a, b) => (a > b ? a : b));
            const fullPath = path.join(patternDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            return NextResponse.json(fileContents);
        }
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch pattern" },
            { status: 500 }
        );
    }
}

/**
 * 테스트용 curl 명령어
 * curl -X POST \
  -H "Authorization: Bearer DAILY_API_KEY" \
  http://localhost:3000/api/generate-english
 */

// 영어 문장 패턴 생성 POST 핸들러
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

        // 기존 패턴 목록 가져오기
        const existingPatternList = getPatternList();

        const result = await generateText({
            model: openrouter("google/gemini-2.0-flash-exp:free"),
            prompt: generatePatternPrompt(existingPatternList),
            temperature: 0.7,
        });

        let patternData;
        try {
            // JSON 부분만 추출
            const jsonMatch = result.text.match(/\{[\s\S]*\}/); // 중괄호로 감싸진 부분 찾기
            const jsonString = jsonMatch ? jsonMatch[0] : result.text;
            patternData = JSON.parse(jsonString);

            await uploadJsonToGitHub({
                json: patternData,
            });

            return NextResponse.json({
                success: true,
                message: "패턴 생성 완료.",
            });
        } catch (parseError) {
            console.error("AI 응답 파싱 오류:", parseError);

            // 파싱 실패 시 에러 발생시켜 상위에서 처리하도록 함
            throw new Error("AI가 생성한 퀴즈 데이터를 처리할 수 없습니다.");
        }
    } catch (error) {
        console.error("API Error:", error);
        const errorMessage =
            error instanceof Error ? error.message : String(error);

        return NextResponse.json(
            { error: "Internal server error", details: errorMessage },
            { status: 500 }
        );
    }
}

// 영어 문장 패턴 생성 프롬프트
const generatePatternPrompt = (
    avoidPatterns: string[] = []
) => `Please generate 5 English sentence patterns.

Conditions:
1. The patterns should be practical and commonly used in daily life.
2. Each pattern must ${
    avoidPatterns.length > 0
        ? "exclude the following patterns: " + avoidPatterns.join(", ")
        : "not duplicate any previously generated patterns."
}
3. Each pattern must include 2 real-life example sentences.
4. All examples should sound natural and be suitable for everyday situations.

Return the result in the following JSON format:
{
  "patterns": [
    {
      "pId": "1",
      "pattern": "Pattern expression",
      "meaning": "Meaning in Korean",
      "examples": [
        {
          "eId": "1",
          "sentence": "Example sentence",
          "translation": "Korean translation"
        },
        // ... 1 more
      ]
    },
    // ... 4 more
  ]
}

Notes:
1. Patterns must be grammatically correct.
2. Meanings should be clear and easy to understand.
3. Example sentences must be practical and usable in real life.
4. All translations should be natural Korean.

You must respond **only** in JSON format.`;

// 기존에 생성된 패턴 목록을 파일에서 읽어옵니다
function getPatternList(): string[] {
    try {
        const fileNames = fs.readdirSync(patternDirectory);
        if (!fileNames || fileNames.length === 0) {
            return [];
        }

        const patternList: string[] = [];

        fileNames.forEach((fileName) => {
            const fullPath = path.join(patternDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            try {
                const parsed = JSON.parse(fileContents) as PatternsResponse;
                parsed.patterns.forEach((item: PatternItem) => {
                    if (item && item.pattern) patternList.push(item.pattern);
                });
            } catch (parseErr) {
                console.error(
                    `Failed to parse pattern file ${fileName}:`,
                    parseErr
                );
                // 파싱 실패한 파일은 건너뜀
            }
        });
        return patternList;
    } catch (err) {
        console.error("getPatternList error:", err);
        return [];
    }
}

// 한국어 버전
/*
const generatePatternPrompt = (
    avoidPatterns: string[] = []
) => `영어 문장 패턴 10개를 생성해주세요.

조건:
1. 일상생활에서 자주 사용되는 실용적인 패턴이어야 합니다
2. 각 패턴은 ${
    avoidPatterns.length > 0
        ? "다음 패턴들을 제외하고 생성해주세요: " + avoidPatterns.join(", ")
        : "이전에 생성된 패턴과 중복되지 않아야 합니다"
}
3. 각 패턴마다 4개의 실제 사용 예문이 필요합니다
4. 모든 예문은 일상적인 상황에서 자연스럽게 사용할 수 있어야 합니다

다음 JSON 형식으로 반환해주세요:
{
  "patterns": [
    {
      "pId": "1",
      "pattern": "패턴 표현",
      "meaning": "한국어 의미",
      "examples": [
        {
          "eId": "1",
          "sentence": "예문",
          "translation": "한국어 번역"
        },
        // ... 3개 더
      ]
    },
    // ... 9개 더
  ]
}

주의사항:
1. 패턴은 문법적으로 정확해야 합니다
2. 의미는 명확하고 이해하기 쉽게 설명해주세요
3. 예문은 실생활에서 바로 활용 가능해야 합니다
4. 모든 번역은 자연스러운 한국어로 작성해주세요

반드시 JSON 형식으로만 응답해주세요.`;
 */
