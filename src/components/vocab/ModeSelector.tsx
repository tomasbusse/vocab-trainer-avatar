"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import {
  MessageCircle,
  BookOpen,
  HelpCircle,
  Mic,
} from "lucide-react";

export type PracticeMode = "conversation" | "flashcard" | "quiz" | "pronunciation";

interface ModeSelectorProps {
  currentMode: PracticeMode;
  onModeChange: (mode: PracticeMode) => void;
  className?: string;
}

const modes = [
  {
    id: "conversation" as PracticeMode,
    name: "Conversation",
    description: "Chat naturally with Emma",
    icon: MessageCircle,
  },
  {
    id: "flashcard" as PracticeMode,
    name: "Flashcards",
    description: "Quick word review",
    icon: BookOpen,
  },
  {
    id: "quiz" as PracticeMode,
    name: "Quiz",
    description: "Test your knowledge",
    icon: HelpCircle,
  },
  {
    id: "pronunciation" as PracticeMode,
    name: "Pronunciation",
    description: "Practice speaking",
    icon: Mic,
  },
];

export function ModeSelector({
  currentMode,
  onModeChange,
  className,
}: ModeSelectorProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-3", className)}>
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;

        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={cn(
              "flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200",
              isActive
                ? "border-[hsl(152,60%,35%)] bg-[hsl(152,60%,97%)]"
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
          >
            <Icon
              className={cn(
                "w-6 h-6 mb-2",
                isActive ? "text-[hsl(152,60%,35%)]" : "text-gray-400"
              )}
            />
            <span
              className={cn(
                "text-sm font-medium",
                isActive ? "text-[hsl(152,60%,35%)]" : "text-gray-700"
              )}
            >
              {mode.name}
            </span>
            <span className="text-xs text-gray-500 mt-0.5 hidden md:block">
              {mode.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
