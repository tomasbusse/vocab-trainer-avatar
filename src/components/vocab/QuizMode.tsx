"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle, XCircle } from "lucide-react";

interface Word {
  word: string;
  definition: string;
  pronunciation: string;
  partOfSpeech: string;
  examples: string[];
  synonyms: string[];
}

interface QuizModeProps {
  words: Word[];
  onComplete: (results: { correct: number; total: number }) => void;
  className?: string;
}

interface QuizQuestion {
  word: Word;
  options: string[];
  correctIndex: number;
}

function generateQuestions(words: Word[]): QuizQuestion[] {
  return words.map((word) => {
    // Get wrong answers from other words
    const otherWords = words.filter((w) => w.word !== word.word);
    const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5);
    const wrongAnswers = shuffledOthers.slice(0, 3).map((w) => w.definition);

    // Create options and shuffle
    const options = [word.definition, ...wrongAnswers];
    const shuffled = options.sort(() => Math.random() - 0.5);

    return {
      word,
      options: shuffled,
      correctIndex: shuffled.indexOf(word.definition),
    };
  });
}

export function QuizMode({ words, onComplete, className }: QuizModeProps) {
  const [questions] = useState<QuizQuestion[]>(() => generateQuestions(words));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctIndex;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === currentQuestion.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete({ correct: score + (isCorrect ? 1 : 0), total: questions.length });
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <Badge variant="default">
          Question {currentIndex + 1} of {questions.length}
        </Badge>
        <Badge variant="success">Score: {score}</Badge>
      </div>

      {/* Question */}
      <Card className="mb-6">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-2">What does this word mean?</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">
            {currentQuestion.word.word}
          </h2>
          <p className="text-gray-400 text-sm">
            ({currentQuestion.word.pronunciation})
          </p>
        </div>
      </Card>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => {
          let styles = "border-gray-200 hover:border-gray-300";

          if (showResult) {
            if (index === currentQuestion.correctIndex) {
              styles = "border-green-500 bg-green-50";
            } else if (index === selectedAnswer && !isCorrect) {
              styles = "border-red-500 bg-red-50";
            }
          } else if (selectedAnswer === index) {
            styles = "border-[hsl(152,60%,35%)] bg-[hsl(152,60%,97%)]";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={cn(
                "w-full p-4 text-left rounded-xl border-2 transition-all",
                styles,
                showResult && "cursor-default"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{option}</span>
                {showResult && index === currentQuestion.correctIndex && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {showResult && index === selectedAnswer && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Result & Next */}
      {showResult && (
        <div className="animate-fadeIn">
          <Card
            variant="accent"
            className={cn(
              "mb-4 text-center",
              isCorrect ? "!bg-green-50 !border-green-200" : "!bg-red-50 !border-red-200"
            )}
          >
            <p
              className={cn(
                "font-semibold",
                isCorrect ? "text-green-700" : "text-red-700"
              )}
            >
              {isCorrect ? "Correct! Great job!" : "Not quite. Keep practicing!"}
            </p>
            {!isCorrect && (
              <p className="text-sm text-gray-600 mt-2">
                <strong>{currentQuestion.word.word}</strong> means:{" "}
                {currentQuestion.word.definition}
              </p>
            )}
          </Card>

          <Button variant="primary" onClick={handleNext} className="w-full">
            {isLastQuestion ? "See Results" : "Next Question"}
          </Button>
        </div>
      )}
    </div>
  );
}
