"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Mic, MicOff, Volume2, RefreshCw, CheckCircle } from "lucide-react";

interface Word {
  word: string;
  definition: string;
  pronunciation: string;
  partOfSpeech: string;
  examples: string[];
}

interface PronunciationModeProps {
  words: Word[];
  onComplete: (results: { correct: number; total: number; avgScore: number }) => void;
  className?: string;
}

export function PronunciationMode({
  words,
  onComplete,
  className,
}: PronunciationModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [scores, setScores] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const currentWord = words[currentIndex];
  const isLastWord = currentIndex === words.length - 1;

  useEffect(() => {
    // Check for speech recognition support
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[0][0].transcript.toLowerCase();
        setTranscript(result);
        evaluatePronunciation(result);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentWord]);

  const startRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(true);
      setTranscript("");
      setShowFeedback(false);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const evaluatePronunciation = (spoken: string) => {
    const target = currentWord.word.toLowerCase();
    const spokenClean = spoken.trim().toLowerCase();

    // Simple scoring - in production use phonetic comparison
    let score = 0;
    if (spokenClean === target) {
      score = 100;
    } else if (spokenClean.includes(target) || target.includes(spokenClean)) {
      score = 75;
    } else {
      // Check character similarity
      const similarity = calculateSimilarity(target, spokenClean);
      score = Math.round(similarity * 100);
    }

    setCurrentScore(score);
    setScores([...scores, score]);
    setShowFeedback(true);
  };

  const calculateSimilarity = (a: string, b: string): number => {
    const longer = a.length > b.length ? a : b;
    const shorter = a.length > b.length ? b : a;
    if (longer.length === 0) return 1.0;

    let matches = 0;
    for (let i = 0; i < shorter.length; i++) {
      if (longer.includes(shorter[i])) matches++;
    }
    return matches / longer.length;
  };

  const speakWord = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = "en-US";
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (isLastWord) {
      const avgScore =
        scores.reduce((a, b) => a + b, 0) / scores.length;
      const correct = scores.filter((s) => s >= 70).length;
      onComplete({ correct, total: words.length, avgScore });
    } else {
      setCurrentIndex(currentIndex + 1);
      setTranscript("");
      setShowFeedback(false);
    }
  };

  const handleRetry = () => {
    setTranscript("");
    setShowFeedback(false);
    setScores(scores.slice(0, -1));
  };

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <Badge variant="default">
          Word {currentIndex + 1} of {words.length}
        </Badge>
        {scores.length > 0 && (
          <Badge variant="success">
            Avg: {Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}%
          </Badge>
        )}
      </div>

      {/* Word Card */}
      <Card className="text-center mb-6">
        <Badge variant="default" className="mb-4">
          {currentWord.partOfSpeech}
        </Badge>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          {currentWord.word}
        </h2>
        <p className="text-gray-500 mb-4">{currentWord.pronunciation}</p>

        <Button variant="secondary" onClick={speakWord} className="mx-auto">
          <Volume2 className="w-4 h-4 mr-2" />
          Hear it
        </Button>
      </Card>

      {/* Recording Section */}
      <Card variant="accent" className="text-center mb-6">
        {!showFeedback ? (
          <>
            <p className="text-gray-600 mb-4">
              {isRecording
                ? "Listening... Say the word!"
                : "Tap the microphone and say the word"}
            </p>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={cn(
                "w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all",
                isRecording
                  ? "bg-red-500 animate-pulse"
                  : "bg-[hsl(152,60%,35%)] hover:bg-[hsl(152,60%,30%)]"
              )}
            >
              {isRecording ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </button>
            {transcript && (
              <p className="mt-4 text-gray-700">
                You said: <strong>&ldquo;{transcript}&rdquo;</strong>
              </p>
            )}
          </>
        ) : (
          <div className="animate-fadeIn">
            <div className="mb-4">
              <p className="text-gray-500 text-sm mb-1">Your score</p>
              <p className="text-5xl font-bold text-[hsl(152,60%,35%)]">
                {currentScore}%
              </p>
            </div>

            <ProgressBar value={currentScore} size="lg" className="mb-4" />

            <p className="text-gray-600 mb-2">
              You said: <strong>&ldquo;{transcript}&rdquo;</strong>
            </p>

            {currentScore >= 80 ? (
              <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Excellent pronunciation!</span>
              </div>
            ) : currentScore >= 50 ? (
              <p className="text-yellow-600 mb-4">
                Good try! Keep practicing.
              </p>
            ) : (
              <p className="text-gray-600 mb-4">
                Let&apos;s try again. Listen carefully to the pronunciation.
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Controls */}
      {showFeedback && (
        <div className="flex gap-3 animate-fadeIn">
          <Button variant="outline" onClick={handleRetry} className="flex-1">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="primary" onClick={handleNext} className="flex-1">
            {isLastWord ? "See Results" : "Next Word"}
          </Button>
        </div>
      )}
    </div>
  );
}
