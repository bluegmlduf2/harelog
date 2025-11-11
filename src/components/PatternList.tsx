import { BookOpen, Volume2 } from "lucide-react";
import {
    PatternItem,
    PatternsResponse as PatternListProps,
} from "@/app/api/generate-english/route";
import { textToSpeech } from "@/lib/textToSpeech";

export default function PatternList({
    patterns,
}: Omit<PatternListProps, "day">) {
    return (
        <div className="space-y-4">
            {patterns.map((pattern: PatternItem) => (
                <div
                    key={pattern.pId}
                    className="overflow-hidden rounded-2xl shadow-lg"
                >
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="bg-white/20 p-2 rounded-lg mt-1">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white text-2xl mb-2">
                                    {pattern.pattern}
                                </h3>
                                <div className="flex items-center">
                                    <div className="inline-block bg-white/90 text-blue-700 px-4 py-1.5 rounded-full text-base">
                                        {pattern.meaning}
                                    </div>
                                    <div className="pl-3">
                                        <Volume2
                                            className="h-5 w-5 cursor-pointer hover:text-gray-200"
                                            onClick={() =>
                                                textToSpeech(pattern.pattern)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white">
                        <div className="space-y-3">
                            {pattern.examples.map((example, idx) => (
                                <div
                                    key={example.eId}
                                    className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl"
                                >
                                    <div className="flex items-start justify-center gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm mt-0.5">
                                            <div className="flex items-center justify-center">
                                                {idx + 1}
                                            </div>
                                            <div className="flex items-center justify-center mt-3">
                                                <Volume2
                                                    className="h-5 w-5 cursor-pointer hover:text-gray-200"
                                                    onClick={() =>
                                                        textToSpeech(
                                                            example.sentence
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-900 mb-2">
                                                {example.sentence}
                                            </p>
                                            <p className="text-gray-600">
                                                {example.translation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
