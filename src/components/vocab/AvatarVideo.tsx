"use client";

import { useRef, useEffect } from "react";
import { VideoTrack } from "@livekit/components-react";
import { Track } from "livekit-client";
import { cn } from "@/lib/utils";

interface AvatarVideoProps {
  className?: string;
  isSpeaking?: boolean;
  isConnected?: boolean;
  fallbackText?: string;
}

export function AvatarVideo({
  className,
  isSpeaking = false,
  isConnected = false,
  fallbackText = "Connecting to Emma...",
}: AvatarVideoProps) {
  return (
    <div
      className={cn(
        "relative w-full avatar-container bg-gradient-to-br from-[hsl(152,60%,97%)] to-white",
        className
      )}
    >
      {/* Avatar placeholder when not connected */}
      {!isConnected && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-[hsl(152,60%,90%)] flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-[hsl(152,60%,35%)] animate-pulse-soft"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">{fallbackText}</p>
        </div>
      )}

      {/* Speaking indicator */}
      {isConnected && isSpeaking && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
          <span className="flex gap-0.5">
            <span className="w-1 h-3 bg-[hsl(152,60%,35%)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1 h-4 bg-[hsl(152,60%,35%)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1 h-2 bg-[hsl(152,60%,35%)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
          <span className="text-xs text-gray-600">Emma is speaking</span>
        </div>
      )}

      {/* Connection status */}
      <div className="absolute top-4 right-4">
        <span
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs",
            isConnected
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          )}
        >
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              isConnected ? "bg-green-500" : "bg-yellow-500 animate-pulse"
            )}
          />
          {isConnected ? "Connected" : "Connecting..."}
        </span>
      </div>
    </div>
  );
}

// LiveKit video track wrapper
interface LiveKitAvatarProps {
  trackRef: Track;
  className?: string;
}

export function LiveKitAvatar({ trackRef, className }: LiveKitAvatarProps) {
  return (
    <div className={cn("w-full avatar-container overflow-hidden", className)}>
      <VideoTrack trackRef={trackRef as any} className="w-full h-full object-cover" />
    </div>
  );
}
