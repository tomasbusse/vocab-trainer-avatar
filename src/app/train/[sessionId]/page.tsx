"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AvatarVideo } from "@/components/vocab/AvatarVideo";
import { ModeSelector, PracticeMode } from "@/components/vocab/ModeSelector";
import { FlashcardMode } from "@/components/vocab/FlashcardMode";
import { QuizMode } from "@/components/vocab/QuizMode";
import { PronunciationMode } from "@/components/vocab/PronunciationMode";
import { ProgressDashboard } from "@/components/vocab/ProgressDashboard";
import {
  Mic,
  MicOff,
  Settings,
  BarChart2,
  MessageCircle,
  X,
} from "lucide-react";

// Demo vocabulary data
const DEMO_WORDS = [
  {
    word: "ephemeral",
    definition: "lasting for a very short time",
    pronunciation: "ih-FEM-er-ul",
    partOfSpeech: "adjective",
    examples: [
      "The ephemeral beauty of cherry blossoms makes them special.",
      "Social media posts are often ephemeral, quickly forgotten.",
      "His fame was ephemeral, lasting only a few months.",
    ],
    synonyms: ["fleeting", "transient", "momentary", "brief"],
  },
  {
    word: "ubiquitous",
    definition: "present, appearing, or found everywhere",
    pronunciation: "yoo-BIK-wi-tus",
    partOfSpeech: "adjective",
    examples: [
      "Smartphones have become ubiquitous in modern society.",
      "Coffee shops are ubiquitous in major cities.",
      "The company's logo is ubiquitous in advertising.",
    ],
    synonyms: ["omnipresent", "pervasive", "universal"],
  },
  {
    word: "serendipity",
    definition: "the occurrence of events by chance in a happy way",
    pronunciation: "ser-en-DIP-i-tee",
    partOfSpeech: "noun",
    examples: [
      "Finding my best friend at that coffee shop was pure serendipity.",
      "Many scientific discoveries happened through serendipity.",
      "The serendipity of meeting her changed his life forever.",
    ],
    synonyms: ["chance", "luck", "fortune"],
  },
  {
    word: "paradigm",
    definition: "a typical example or pattern of something; a model",
    pronunciation: "PAIR-uh-dime",
    partOfSpeech: "noun",
    examples: [
      "The internet created a new paradigm for communication.",
      "We need a paradigm shift in how we approach this problem.",
      "This represents a paradigm of excellent customer service.",
    ],
    synonyms: ["model", "pattern", "example"],
  },
  {
    word: "mitigate",
    definition: "to make less severe, serious, or painful",
    pronunciation: "MIT-ih-gate",
    partOfSpeech: "verb",
    examples: [
      "We must mitigate the risks of this project.",
      "The insurance will help mitigate financial losses.",
      "Trees help mitigate the effects of pollution.",
    ],
    synonyms: ["reduce", "lessen", "alleviate"],
  },
];

const DEMO_STATS = {
  totalWords: 5,
  masteredWords: 1,
  learningWords: 2,
  newWords: 2,
  avgMastery: 45,
  avgPronunciation: 72,
  totalReviews: 15,
  streak: 3,
  practicedToday: true,
};

export default function TrainingPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [mode, setMode] = useState<PracticeMode>("conversation");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [practiceResult, setPracticeResult] = useState<{
    correct: number;
    total: number;
    avgScore?: number;
  } | null>(null);

  // Connect to LiveKit room
  const connectToRoom = useCallback(async () => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);

    try {
      const response = await fetch("/api/livekit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: `vocab-${sessionId}`,
          participantName: `student-${sessionId.slice(0, 6)}`,
        }),
      });

      if (response.ok) {
        const { token, url } = await response.json();
        // In production, connect to LiveKit with token
        console.log("LiveKit token generated:", { token: token.slice(0, 20) + "...", url });

        // Simulate connection for demo
        setTimeout(() => {
          setIsConnected(true);
          setIsConnecting(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to connect:", error);
      setIsConnecting(false);
    }
  }, [sessionId, isConnecting, isConnected]);

  // Auto-connect on mount for conversation mode
  useEffect(() => {
    if (mode === "conversation" && !isConnected) {
      connectToRoom();
    }
  }, [mode, isConnected, connectToRoom]);

  const handleModeComplete = (result: { correct: number; total: number; avgScore?: number }) => {
    setPracticeResult(result);
  };

  const handleContinuePractice = () => {
    setPracticeResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[hsl(152,60%,35%)] flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">VocabTrainer</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProgress(!showProgress)}
            >
              <BarChart2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Practice Result Modal */}
        {practiceResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md text-center animate-fadeIn">
              <button
                onClick={handleContinuePractice}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="py-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-[hsl(152,60%,90%)] flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-[hsl(152,60%,35%)]">
                    {Math.round((practiceResult.correct / practiceResult.total) * 100)}%
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Great Practice!
                </h2>
                <p className="text-gray-500 mb-6">
                  You got {practiceResult.correct} out of {practiceResult.total} correct
                  {practiceResult.avgScore !== undefined &&
                    ` with ${Math.round(practiceResult.avgScore)}% pronunciation score`}
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setMode("conversation")}
                    className="flex-1"
                  >
                    Talk to Emma
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleContinuePractice}
                    className="flex-1"
                  >
                    Practice More
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Progress Sidebar (Mobile: Modal, Desktop: Sidebar) */}
        {showProgress && (
          <div className="fixed inset-0 z-40 md:relative md:inset-auto">
            <div
              className="absolute inset-0 bg-black/50 md:hidden"
              onClick={() => setShowProgress(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl md:relative md:w-full md:shadow-none md:mb-6 overflow-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4 md:hidden">
                  <h2 className="font-semibold">Your Progress</h2>
                  <button onClick={() => setShowProgress(false)}>
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <ProgressDashboard stats={DEMO_STATS} />
              </div>
            </div>
          </div>
        )}

        {/* Mode Selector */}
        <ModeSelector
          currentMode={mode}
          onModeChange={setMode}
          className="mb-6"
        />

        {/* Conversation Mode with Avatar */}
        {mode === "conversation" && (
          <div className="space-y-4">
            {/* Avatar Video */}
            <AvatarVideo
              isConnected={isConnected}
              isSpeaking={false}
              fallbackText={isConnecting ? "Connecting to Emma..." : "Click below to start"}
            />

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              {!isConnected ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={connectToRoom}
                  isLoading={isConnecting}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start Conversation
                </Button>
              ) : (
                <>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      isMuted
                        ? "bg-red-500 text-white"
                        : "bg-[hsl(152,60%,35%)] text-white"
                    }`}
                  >
                    {isMuted ? (
                      <MicOff className="w-6 h-6" />
                    ) : (
                      <Mic className="w-6 h-6" />
                    )}
                  </button>

                  <Badge variant="success">
                    {isMuted ? "Muted" : "Listening..."}
                  </Badge>
                </>
              )}
            </div>

            {/* Chat hint */}
            {isConnected && (
              <Card variant="accent" className="text-center">
                <p className="text-sm text-gray-600">
                  Speak to Emma to learn vocabulary. Try saying:
                  <br />
                  <span className="font-medium text-[hsl(152,60%,35%)]">
                    &ldquo;What does ephemeral mean?&rdquo;
                  </span>
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Flashcard Mode */}
        {mode === "flashcard" && (
          <FlashcardMode
            words={DEMO_WORDS}
            onComplete={handleModeComplete}
          />
        )}

        {/* Quiz Mode */}
        {mode === "quiz" && (
          <QuizMode
            words={DEMO_WORDS}
            onComplete={handleModeComplete}
          />
        )}

        {/* Pronunciation Mode */}
        {mode === "pronunciation" && (
          <PronunciationMode
            words={DEMO_WORDS}
            onComplete={handleModeComplete}
          />
        )}
      </main>
    </div>
  );
}
