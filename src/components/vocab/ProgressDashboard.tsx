"use client";

import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import {
  TrendingUp,
  BookOpen,
  Trophy,
  Flame,
  Clock,
  Target,
} from "lucide-react";

interface ProgressStats {
  totalWords: number;
  masteredWords: number;
  learningWords: number;
  newWords: number;
  avgMastery: number;
  avgPronunciation: number;
  totalReviews: number;
  streak: number;
  practicedToday: boolean;
}

interface ProgressDashboardProps {
  stats: ProgressStats;
  className?: string;
}

export function ProgressDashboard({
  stats,
  className,
}: ProgressDashboardProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Streak & Daily Progress */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center">
          <div className="flex flex-col items-center">
            <Flame
              className={cn(
                "w-8 h-8 mb-2",
                stats.streak > 0 ? "text-orange-500" : "text-gray-300"
              )}
            />
            <p className="text-3xl font-bold text-gray-900">{stats.streak}</p>
            <p className="text-sm text-gray-500">Day Streak</p>
          </div>
        </Card>

        <Card className="text-center">
          <div className="flex flex-col items-center">
            <Target
              className={cn(
                "w-8 h-8 mb-2",
                stats.practicedToday ? "text-green-500" : "text-gray-300"
              )}
            />
            <p className="text-3xl font-bold text-gray-900">
              {stats.practicedToday ? "Done" : "Todo"}
            </p>
            <p className="text-sm text-gray-500">Today&apos;s Practice</p>
          </div>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[hsl(152,60%,35%)]" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Average Mastery</span>
                <span className="font-medium text-gray-900">{stats.avgMastery}%</span>
              </div>
              <ProgressBar value={stats.avgMastery} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Pronunciation Score</span>
                <span className="font-medium text-gray-900">{stats.avgPronunciation}%</span>
              </div>
              <ProgressBar value={stats.avgPronunciation} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Word Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[hsl(152,60%,35%)]" />
            Vocabulary Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="w-12 h-12 mx-auto rounded-full bg-[hsl(152,60%,90%)] flex items-center justify-center mb-2">
                <Trophy className="w-6 h-6 text-[hsl(152,60%,35%)]" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.masteredWords}
              </p>
              <p className="text-xs text-gray-500">Mastered</p>
            </div>

            <div>
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.learningWords}
              </p>
              <p className="text-xs text-gray-500">Learning</p>
            </div>

            <div>
              <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.newWords}</p>
              <p className="text-xs text-gray-500">New</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[hsl(152,60%,35%)]" />
            Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalWords}
              </p>
              <p className="text-xs text-gray-500">Total Words</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalReviews}
              </p>
              <p className="text-xs text-gray-500">Total Reviews</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
