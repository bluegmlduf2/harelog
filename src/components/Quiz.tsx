import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, RotateCcw, Trophy, Zap } from "lucide-react";
import { PatternsResponse as PatternListProps } from "@/app/api/generate-english/route";

interface QuizQuestion {
    type: "sentence" | "meaning";
    question: string;
    correctAnswer: string;
    options: string[];
    pattern: string;
}

export default function QuizPage({ patterns }: Omit<PatternListProps, "day">) {
    const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(
        null
    );
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });

    const generateQuestion = (): QuizQuestion => {
        const randomPattern =
            patterns[Math.floor(Math.random() * patterns.length)];
        const questionType = Math.random() > 0.5 ? "sentence" : "meaning";

        if (questionType === "sentence") {
            const randomExample =
                randomPattern.examples[
                    Math.floor(Math.random() * randomPattern.examples.length)
                ];

            const allTranslations = patterns.flatMap((p) =>
                p.examples.map((e) => e.translation)
            );

            const wrongAnswers = allTranslations
                .filter((t) => t !== randomExample.translation)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);

            const options = [randomExample.translation, ...wrongAnswers].sort(
                () => Math.random() - 0.5
            );

            return {
                type: "sentence",
                question: randomExample.sentence,
                correctAnswer: randomExample.translation,
                options,
                pattern: randomPattern.pattern,
            };
        } else {
            const allMeanings = patterns.map((p) => p.meaning);
            const wrongAnswers = allMeanings
                .filter((m) => m !== randomPattern.meaning)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);

            const options = [randomPattern.meaning, ...wrongAnswers].sort(
                () => Math.random() - 0.5
            );

            return {
                type: "meaning",
                question: randomPattern.pattern,
                correctAnswer: randomPattern.meaning,
                options,
                pattern: randomPattern.pattern,
            };
        }
    };

    const startNewQuestion = () => {
        setCurrentQuestion(generateQuestion());
        setSelectedAnswer(null);
        setIsAnswered(false);
    };

    const handleAnswerSelect = (answer: string) => {
        if (isAnswered) return;

        setSelectedAnswer(answer);
        setIsAnswered(true);

        const isCorrect = answer === currentQuestion?.correctAnswer;
        setScore((prev) => ({
            correct: prev.correct + (isCorrect ? 1 : 0),
            total: prev.total + 1,
        }));
    };

    const resetQuiz = () => {
        setScore({ correct: 0, total: 0 });
        startNewQuestion();
    };

    useEffect(() => {
        startNewQuestion();
    }, []);

    if (!currentQuestion) {
        return null;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const accuracy =
        score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

    return (
        <div className="space-y-4">
            {/* Score Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl shadow-md overflow-hidden">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <div className="flex items-center gap-2 mb-1">
                            <Trophy className="h-4 w-4" />
                            <span className="text-blue-100">점수</span>
                        </div>
                        <div className="text-2xl">
                            {score.correct}/{score.total}
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl shadow-md overflow-hidden">
                    <div className="p-4 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="h-4 w-4" />
                            <span className="text-cyan-100">정확도</span>
                        </div>
                        <div className="text-2xl">{accuracy}%</div>
                    </div>
                </div>
            </div>

            {/* Question Card */}
            <div className="rounded-2xl shadow-lg bg-white">
                <div className="p-6">
                    <div className="mb-4">
                        <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mb-4">
                            {currentQuestion.type === "sentence"
                                ? "문장 번역"
                                : "패턴 의미"}
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border-2 border-blue-100">
                            <p className="text-gray-900 text-lg">
                                {currentQuestion.question}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedAnswer === option;
                            const isCorrectOption =
                                option === currentQuestion.correctAnswer;

                            let buttonClass =
                                "w-full text-left py-4 px-5 rounded-xl transition-all ";

                            if (isAnswered) {
                                if (isCorrectOption) {
                                    buttonClass +=
                                        "bg-green-50 border-2 border-green-400 text-green-900 cursor-default";
                                } else if (isSelected && !isCorrect) {
                                    buttonClass +=
                                        "bg-red-50 border-2 border-red-400 text-red-900 cursor-default";
                                } else {
                                    buttonClass +=
                                        "bg-gray-50 border border-gray-200 text-gray-500 cursor-default";
                                }
                            } else {
                                buttonClass += isSelected
                                    ? "bg-blue-50 border-2 border-blue-400 text-blue-900 cursor-pointer"
                                    : "bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer";
                            }

                            return (
                                <button
                                    key={index}
                                    className={buttonClass}
                                    onClick={() => handleAnswerSelect(option)}
                                    disabled={isAnswered}
                                >
                                    <div className="flex items-center justify-between w-full gap-3">
                                        <span className="flex-1 text-left">
                                            {option}
                                        </span>
                                        {isAnswered && isCorrectOption && (
                                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                        )}
                                        {isAnswered &&
                                            isSelected &&
                                            !isCorrect && (
                                                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                            )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {isAnswered && (
                        <div
                            className={`mt-4 p-4 rounded-2xl ${
                                isCorrect
                                    ? "bg-green-50 border-2 border-green-200"
                                    : "bg-red-50 border-2 border-red-200"
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {isCorrect ? (
                                    <>
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        <span className="text-green-900">
                                            정답입니다! 🎉
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-5 w-5 text-red-600" />
                                        <span className="text-red-900">
                                            아쉽네요 😢
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-gray-700 text-sm">
                                패턴:{" "}
                                <span className="text-blue-600">
                                    {currentQuestion.pattern}
                                </span>
                            </p>
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={startNewQuestion}
                            disabled={!isAnswered}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-12 text-base rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            다음 문제
                        </button>
                        <button
                            onClick={resetQuiz}
                            className="h-12 px-6 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
