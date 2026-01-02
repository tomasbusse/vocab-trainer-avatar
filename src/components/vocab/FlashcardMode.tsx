"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ChevronLeft, ChevronRight, RotateCcw, Volume2 } from "lucide-react";

interface Word {
  word: string;
  definition: string;
  pronunciation: string;
  partOfSpeech: string;
  examples: string[];
  synonyms: string[];
}

interface FlashcardModeProps {
  words: Word[];
  onComplete: (results: { correct: number; total: number }) => void;
  className?: string;
}

export function FlashcardMode({
  words,
  onComplete,
  className,
}: FlashcardModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const currentWord = words[currentIndex];
  const isLastCard = currentIndex === words.length - 1;

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleKnown = () => {
    setResults([...results, true]);
    goToNext();
  };

  const handleUnknown = () => {
    setResults([...results, false]);
    goToNext();
  };

  const goToNext = () => {
    if (isLastCard) {
      const correct = results.filter(Boolean).length + 1; // Include current
      onComplete({ correct, total: words.length });
    } else {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setResults(results.slice(0, -1));
    }
  };

  const speakWord = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Progress */}
      <div className="w-full flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          {currentIndex + 1} / {words.length}
        </span>
        <div className="flex gap-1">
          {words.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full",
                idx < currentIndex
                  ? results[idx]
                    ? "bg-green-500"
                    : "bg-red-400"
                  : idx === currentIndex
                  ? "bg-[hsl(152,60%,35%)]"
                  : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>

      {/* Flashcard */}
      <div
        onClick={handleFlip}
        className={cn(
          "w-full max-w-md aspect-[4/3] cursor-pointer perspective-1000",
          "relative preserve-3d transition-transform duration-500",
          isFlipped && "rotate-y-180"
        )}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden",
            "bg-white rounded-2xl shadow-lg border-2 border-gray-100",
            "flex flex-col items-center justify-center p-6"
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          <Badge variant="default" className="mb-4">
            {currentWord.partOfSpeech}
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {currentWord.word}
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            {currentWord.pronunciation}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              speakWord();
            }}
            className="p-2 rounded-full bg-[hsl(152,60%,95%)] text-[hsl(152,60%,35%)] hover:bg-[hsl(152,60%,90%)]"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <p className="text-xs text-gray-400 mt-4">Tap to see definition</p>
        </div>

        {/* Back */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden",
            "bg-[hsl(152,60%,97%)] rounded-2xl shadow-lg border-2 border-[hsl(152,60%,85%)]",
            "flex flex-col items-center justify-center p-6"
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <p className="text-xl text-gray-800 text-center mb-4">
            {currentWord.definition}
          </p>
          <div className="text-sm text-gray-600 text-center">
            <p className="italic">&ldquo;{currentWord.examples[0]}&rdquo;</p>
          </div>
          <p className="text-xs text-gray-400 mt-4">Tap to flip back</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-6">
        <Button
          variant="ghost"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button variant="outline" onClick={handleUnknown}>
          Still Learning
        </Button>

        <Button variant="primary" onClick={handleKnown}>
          I Know This
        </Button>

        <Button variant="ghost" onClick={goToNext} disabled={isLastCard}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
