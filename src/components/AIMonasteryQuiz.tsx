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
        <section id="quiz" className="section-padding bg-background relative overflow-hidden">

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
                        <Brain className="w-3.5 h-3.5" />
                        AI Quiz Challenge
                    </div>
                    <h2 className="section-heading text-foreground">
                        Test Your Monastery Knowledge
                    </h2>
                    <p className="section-subheading">
                        Challenge yourself with AI-generated questions about Sikkim's monasteries,
                        Buddhist culture, and heritage.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    {!quizStarted ? (
                        <div className="bg-card rounded-3xl border border-border/60 shadow-premium">
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-8">
                                    <Brain className="w-10 h-10 text-background" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-4">
                                    Ready to Test Your Knowledge?
                                </h3>
                                <p className="text-muted-foreground mb-8">
                                    5 AI-generated questions about Sikkim's monasteries and Buddhist heritage.
                                </p>
                                <Button
                                    onClick={startQuiz}
                                    className="bg-foreground text-background hover:bg-foreground/90 px-10 py-6 text-base rounded-full transition-all duration-300 hover:scale-105 gap-2 font-semibold"
                                >
                                    <Zap className="w-5 h-5" />
                                    Start AI Quiz
                                </Button>
                            </div>
                        </div>
                    ) : isLoading ? (
                        <div className="bg-card rounded-3xl border border-border/60 shadow-premium">
                            <div className="p-12 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                    <p className="text-lg text-muted-foreground font-medium">Generating unique quiz...</p>
                                    <p className="text-sm text-muted-foreground">AI is crafting questions just for you</p>
                                </div>
                            </div>
                        </div>
                    ) : showResult ? (
                        <div className="bg-card rounded-3xl border border-border/60 shadow-premium overflow-hidden">
                            <div className="bg-foreground p-8 text-background text-center">
                                <div className="text-5xl mb-4">{getScoreEmoji()}</div>
                                <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                                <p className="text-background/60">{getScoreMessage()}</p>
                            </div>
                            <div className="p-8 text-center">
                                <div className="flex items-center justify-center gap-2 mb-8">
                                    <Trophy className="w-7 h-7 text-primary" />
                                    <span className="text-4xl font-bold text-foreground">
                                        {score}/{questions.length}
                                    </span>
                                </div>

                                <div className="w-full h-2 bg-secondary rounded-full mb-8 overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${(score / questions.length) * 100}%` }}
                                    />
                                </div>

                                <Button
                                    onClick={startQuiz}
                                    className="bg-foreground text-background hover:bg-foreground/90 gap-2 px-8 rounded-full font-medium"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    New Quiz
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-card rounded-3xl border border-border/60 shadow-premium overflow-hidden">
                            {/* Progress bar */}
                            <div className="h-1.5 bg-secondary">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                                />
                            </div>

                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                                        Question {currentQ + 1}/{questions.length}
                                    </span>
                                    <span className="text-xs font-semibold text-foreground bg-secondary px-3 py-1 rounded-full">
                                        Score: {score}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-foreground mb-8">
                                    {questions[currentQ]?.question}
                                </h3>

                                <div className="space-y-3 mb-8">
                                    {questions[currentQ]?.options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswer(index)}
                                            disabled={answered}
                                            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-3 ${answered
                                                ? index === questions[currentQ].correct
                                                    ? "border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                                    : index === selected
                                                        ? "border-red-400 bg-red-500/10 text-red-700 dark:text-red-400"
                                                        : "border-border text-muted-foreground"
                                                : selected === index
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:border-primary/50 hover:bg-primary/5"
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
                                    <div className={`p-4 rounded-xl mb-6 ${selected === questions[currentQ].correct
                                        ? "bg-emerald-500/10 border border-emerald-500/20"
                                        : "bg-primary/10 border border-primary/20"
                                        }`}>
                                        <p className="text-sm text-foreground">
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
                                        className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-xl font-medium"
                                    >
                                        {currentQ < questions.length - 1 ? "Next Question →" : "See Results 🏆"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AIMonasteryQuiz;
