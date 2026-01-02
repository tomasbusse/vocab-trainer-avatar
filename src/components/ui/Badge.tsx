"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "info" | "mastery";
  masteryLevel?: number;
}

export function Badge({
  className,
  variant = "default",
  masteryLevel,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-[hsl(152,60%,90%)] text-[hsl(152,60%,25%)]",
    warning: "bg-yellow-100 text-yellow-700",
    info: "bg-blue-100 text-blue-700",
    mastery: getMasteryClass(masteryLevel),
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

function getMasteryClass(level?: number): string {
  if (!level || level < 20) return "mastery-new";
  if (level < 50) return "mastery-familiar";
  if (level < 80) return "mastery-learning";
  return "mastery-mastered";
}
