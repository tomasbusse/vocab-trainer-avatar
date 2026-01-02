import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRoomName(sessionToken: string): string {
  return `vocab-${sessionToken}`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getMasteryLabel(level: number): string {
  if (level >= 80) return "Mastered";
  if (level >= 50) return "Learning";
  if (level >= 20) return "Familiar";
  return "New";
}

export function getMasteryColor(level: number): string {
  if (level >= 80) return "text-green-600";
  if (level >= 50) return "text-emerald-500";
  if (level >= 20) return "text-yellow-500";
  return "text-gray-400";
}
