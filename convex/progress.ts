import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Record progress for a word
export const recordAttempt = mutation({
  args: {
    sessionId: v.id("sessions"),
    wordListId: v.id("wordLists"),
    word: v.string(),
    correct: v.boolean(),
    pronunciationScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("progress")
      .withIndex("by_session_word", (q) =>
        q.eq("sessionId", args.sessionId).eq("word", args.word)
      )
      .first();

    const now = Date.now();

    if (existing) {
      // Update existing progress
      const newTimesReviewed = existing.timesReviewed + 1;
      const newTimesCorrect = existing.timesCorrect + (args.correct ? 1 : 0);

      // Calculate new mastery level (simple algorithm)
      const correctRate = newTimesCorrect / newTimesReviewed;
      const newMastery = Math.min(100, Math.round(correctRate * 100));

      // Update pronunciation scores if provided
      let pronunciationScores = existing.pronunciationScores;
      let avgPronunciationScore = existing.avgPronunciationScore;

      if (args.pronunciationScore !== undefined) {
        pronunciationScores = [...pronunciationScores, args.pronunciationScore];
        avgPronunciationScore =
          pronunciationScores.reduce((a, b) => a + b, 0) / pronunciationScores.length;
      }

      await ctx.db.patch(existing._id, {
        masteryLevel: newMastery,
        timesReviewed: newTimesReviewed,
        timesCorrect: newTimesCorrect,
        lastReviewedAt: now,
        pronunciationScores,
        avgPronunciationScore,
      });

      return existing._id;
    } else {
      // Create new progress entry
      const pronunciationScores = args.pronunciationScore !== undefined
        ? [args.pronunciationScore]
        : [];

      return await ctx.db.insert("progress", {
        sessionId: args.sessionId,
        wordListId: args.wordListId,
        word: args.word,
        masteryLevel: args.correct ? 20 : 5,
        timesReviewed: 1,
        timesCorrect: args.correct ? 1 : 0,
        lastReviewedAt: now,
        pronunciationScores,
        avgPronunciationScore: args.pronunciationScore ?? 0,
      });
    }
  },
});

// Get all progress for a session
export const getBySession = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("progress")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
  },
});

// Get words needing review (low mastery or not reviewed recently)
export const getWordsToReview = query({
  args: {
    sessionId: v.id("sessions"),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("progress")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // Sort by mastery level (lowest first), then by last reviewed (oldest first)
    const sorted = progress.sort((a, b) => {
      if (a.masteryLevel !== b.masteryLevel) {
        return a.masteryLevel - b.masteryLevel;
      }
      return a.lastReviewedAt - b.lastReviewedAt;
    });

    return sorted.slice(0, args.count);
  },
});

// Get session statistics
export const getSessionStats = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("progress")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    if (progress.length === 0) {
      return {
        totalWords: 0,
        masteredWords: 0,
        learningWords: 0,
        newWords: 0,
        avgMastery: 0,
        avgPronunciation: 0,
        totalReviews: 0,
      };
    }

    const masteredWords = progress.filter((p) => p.masteryLevel >= 80).length;
    const learningWords = progress.filter(
      (p) => p.masteryLevel >= 30 && p.masteryLevel < 80
    ).length;
    const newWords = progress.filter((p) => p.masteryLevel < 30).length;
    const avgMastery =
      progress.reduce((acc, p) => acc + p.masteryLevel, 0) / progress.length;
    const pronunciationProgress = progress.filter((p) => p.avgPronunciationScore > 0);
    const avgPronunciation =
      pronunciationProgress.length > 0
        ? pronunciationProgress.reduce((acc, p) => acc + p.avgPronunciationScore, 0) /
          pronunciationProgress.length
        : 0;
    const totalReviews = progress.reduce((acc, p) => acc + p.timesReviewed, 0);

    return {
      totalWords: progress.length,
      masteredWords,
      learningWords,
      newWords,
      avgMastery: Math.round(avgMastery),
      avgPronunciation: Math.round(avgPronunciation),
      totalReviews,
    };
  },
});
