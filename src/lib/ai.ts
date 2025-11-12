import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

const MODELS = [
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen3-coder:free",
    "mistralai/mistral-small-3.2-24b-instruct:free",
    "deepseek/deepseek-chat-v3.1:free",
];

export async function generatePatternWithFallback(
    prompt: string,
    temperature = 0.7
): Promise<{ text: string }> {
    for (const modelName of MODELS) {
        try {
            console.log(`🧠 Trying model: ${modelName}`);
            const result = await generateText({
                model: openrouter(modelName),
                prompt,
                temperature,
            });
            console.log(`✅ Success with ${modelName}`);
            return result;
        } catch (error) {
            console.error(
                error instanceof Error
                    ? `"모델명: "+${modelName + " 에러내용:" + error.message}`
                    : "AI 생성중 알 수 없는 오류 발생"
            );

            continue; // 다음 모델로 시도
        }
    }

    throw new Error("❌ All models failed to generate text.");
}
