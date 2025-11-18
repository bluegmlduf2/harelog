import { Trophy, TrendingUp, BookOpen } from "lucide-react";

interface EmptyStatisticsProps {
    setActiveTab: React.Dispatch<
        React.SetStateAction<"patterns" | "quiz" | "statistics">
    >;
}

export function EmptyStatisticsView({ setActiveTab }: EmptyStatisticsProps) {
    return (
        <div className="space-y-4">
            <div className="rounded-2xl shadow-lg bg-white p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mb-6">
                    <BookOpen className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-gray-900 mb-2">아직 학습 기록이 없어요</h3>
                <p className="text-gray-600 mb-6">
                    퀴즈를 풀면 일자별 학습 통계를 확인할 수 있어요
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl shadow-md cursor-pointer">
                    <Trophy className="h-4 w-4" />
                    <span onClick={() => setActiveTab("quiz")}>
                        퀴즈로 시작하기
                    </span>
                </div>
            </div>

            <div className="rounded-2xl shadow-md bg-gradient-to-br from-cyan-50 to-blue-50 p-5 border-2 border-cyan-100">
                <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-gray-900 mb-1">학습 팁 💡</p>
                        <p className="text-gray-600 text-sm">
                            매일 조금씩 퀴즈를 풀면서 패턴을 익히면 영어 실력이
                            빠르게 향상됩니다!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
