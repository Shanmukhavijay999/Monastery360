import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Brain,
    Trophy,
    Sparkles,
    Loader2,
    CheckCircle2,
    XCircle,
    RotateCcw,
    Zap,
} from "lucide-react";
import { generateQuiz } from "@/lib/gemini";

interface QuizQuestion {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}

const AIMonasteryQuiz = () => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [answered, setAnswered] = useState(false);

    const startQuiz = async () => {
        setIsLoading(true);
        setQuizStarted(true);
        setScore(0);
        setCurrentQ(0);
        setSelected(null);
        setShowResult(false);
        setAnswered(false);

        try {
            const result = await generateQuiz();
            // Extract JSON from the response
            const jsonMatch = result.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                setQuestions(parsed);
            } else {
                throw new Error("Invalid format");
            }
        } catch {
            // Fallback questions
            setQuestions([
                {
                    question: "Which is the oldest monastery in Sikkim?",
                    options: ["A) Rumtek Monastery", "B) Pemayangtse Monastery", "C) Tashiding Monastery", "D) Enchey Monastery"],
                    correct: 1,
                    explanation: "Pemayangtse Monastery, established in 1705, is one of the oldest in Sikkim.",
                },
                {
                    question: "What Buddhist lineage does Rumtek Monastery belong to?",
                    options: ["A) Nyingma", "B) Gelug", "C) Kagyu", "D) Sakya"],
                    correct: 2,
                    explanation: "Rumtek is the main seat of the Kagyu lineage of Tibetan Buddhism.",
                },
                {
                    question: "What festival marks the Tibetan New Year?",
                    options: ["A) Diwali", "B) Losar", "C) Saga Dawa", "D) Bumchu"],
                    correct: 1,
                    explanation: "Losar is the Tibetan New Year celebration, marked with prayers and cultural performances.",
                },
                {
                    question: "What is a Thangka?",
                    options: ["A) A prayer bell", "B) A sacred painting", "C) A monastery gate", "D) A meditation cushion"],
                    correct: 1,
                    explanation: "Thangka is a Tibetan Buddhist painting on silk or cotton, depicting Buddhist deities.",
                },
                {
                    question: "How far is Rumtek Monastery from Gangtok?",
                    options: ["A) 3 km", "B) 24 km", "C) 110 km", "D) 40 km"],
                    correct: 1,
                    explanation: "Rumtek Monastery is located about 24 km from Gangtok, the capital of Sikkim.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = (index: number) => {
        if (answered) return;
        setSelected(index);
        setAnswered(true);
        if (index === questions[currentQ].correct) {
            setScore((prev) => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ((prev) => prev + 1);
            setSelected(null);
            setAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    const getScoreEmoji = () => {
        const percentage = (score / questions.length) * 100;
        if (percentage >= 80) return "🏆";
        if (percentage >= 60) return "🎉";
        if (percentage >= 40) return "💪";
        return "📚";
    };

    const getScoreMessage = () => {
        const percentage = (score / questions.length) * 100;
        if (percentage >= 80) return "Monastery Master! You're a true expert!";
        if (percentage >= 60) return "Great knowledge! Keep exploring!";
        if (percentage >= 40) return "Good effort! Visit more monasteries!";
        return "Keep learning! The monasteries await you!";
    };

    return (
        <section id="quiz" className="py-20 bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
            <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg shadow-purple-200">
                        <Brain className="w-4 h-4" />
                        AI Quiz Challenge
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-earth mb-4">
                        Test Your Monastery Knowledge
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Challenge yourself with AI-generated questions about Sikkim's monasteries,
                        Buddhist culture, and heritage. Every quiz is unique!
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    {!quizStarted ? (
                        <Card className="shadow-2xl border-purple-100 animate-fade-in-up">
                            <CardContent className="p-12 text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-purple-200">
                                    <Brain className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-deep-earth mb-4">
                                    Ready to Test Your Knowledge?
                                </h3>
                                <p className="text-muted-foreground mb-8">
                                    5 AI-generated questions about Sikkim's monasteries and Buddhist heritage.
                                    Each quiz is unique and crafted by AI!
                                </p>
                                <Button
                                    onClick={startQuiz}
                                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-10 py-6 text-lg rounded-2xl shadow-xl shadow-purple-200 transition-all duration-300 hover:scale-105 gap-3"
                                >
                                    <Zap className="w-5 h-5" />
                                    Start AI Quiz
                                </Button>
                            </CardContent>
                        </Card>
                    ) : isLoading ? (
                        <Card className="shadow-2xl border-purple-100 animate-fade-in-up">
                            <CardContent className="p-12 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative">
                                        <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
                                        <Sparkles className="w-6 h-6 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
                                    </div>
                                    <p className="text-xl text-gray-500 font-medium">Generating unique quiz...</p>
                                    <p className="text-sm text-gray-400">AI is crafting questions just for you</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : showResult ? (
                        <Card className="shadow-2xl border-purple-100 animate-fade-in-up overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 p-8 text-white text-center">
                                <div className="text-6xl mb-4">{getScoreEmoji()}</div>
                                <h3 className="text-3xl font-bold mb-2">Quiz Complete!</h3>
                                <p className="text-white/80">{getScoreMessage()}</p>
                            </div>
                            <CardContent className="p-8 text-center">
                                <div className="flex items-center justify-center gap-2 mb-8">
                                    <Trophy className="w-8 h-8 text-amber-500" />
                                    <span className="text-4xl font-bold text-deep-earth">
                                        {score}/{questions.length}
                                    </span>
                                </div>

                                {/* Score bar */}
                                <div className="w-full h-4 bg-gray-200 rounded-full mb-8 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${(score / questions.length) * 100}%` }}
                                    />
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <Button
                                        onClick={startQuiz}
                                        className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 gap-2 px-8"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        New Quiz
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="shadow-2xl border-purple-100 animate-fade-in-up overflow-hidden">
                            {/* Progress bar */}
                            <div className="h-2 bg-gray-200">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                                    style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                                />
                            </div>

                            <CardContent className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                                        Question {currentQ + 1}/{questions.length}
                                    </span>
                                    <span className="text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                                        Score: {score}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-deep-earth mb-8">
                                    {questions[currentQ]?.question}
                                </h3>

                                <div className="space-y-3 mb-8">
                                    {questions[currentQ]?.options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswer(index)}
                                            disabled={answered}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ${answered
                                                    ? index === questions[currentQ].correct
                                                        ? "border-green-400 bg-green-50 text-green-700"
                                                        : index === selected
                                                            ? "border-red-400 bg-red-50 text-red-700"
                                                            : "border-gray-200 text-gray-400"
                                                    : selected === index
                                                        ? "border-purple-400 bg-purple-50"
                                                        : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                                                }`}
                                        >
                                            {answered && index === questions[currentQ].correct && (
                                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            )}
                                            {answered && index === selected && index !== questions[currentQ].correct && (
                                                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                            )}
                                            <span className="text-sm font-medium">{option}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Explanation */}
                                {answered && (
                                    <div className={`p-4 rounded-xl mb-6 animate-fade-in-up ${selected === questions[currentQ].correct
                                            ? "bg-green-50 border border-green-200"
                                            : "bg-amber-50 border border-amber-200"
                                        }`}>
                                        <p className="text-sm text-gray-700">
                                            <strong>
                                                {selected === questions[currentQ].correct ? "✅ Correct!" : "❌ Not quite."}
                                            </strong>{" "}
                                            {questions[currentQ].explanation}
                                        </p>
                                    </div>
                                )}

                                {answered && (
                                    <Button
                                        onClick={nextQuestion}
                                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
                                    >
                                        {currentQ < questions.length - 1 ? "Next Question →" : "See Results 🏆"}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AIMonasteryQuiz;
