import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Start a new practice session
export const start = mutation({
  args: {
    sessionId: v.id("sessions"),
    mode: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("practiceHistory", {
      sessionId: args.sessionId,
      mode: args.mode,
      startedAt: Date.now(),
      wordsAttempted: 0,
      wordsCorrect: 0,
      totalScore: 0,
    });
  },
});

// End a practice session
export const end = mutation({
  args: {
    practiceHistoryId: v.id("practiceHistory"),
    wordsAttempted: v.number(),
    wordsCorrect: v.number(),
    totalScore: v.number(),
  },
  handler: async (ctx, args) => {
    const history = await ctx.db.get(args.practiceHistoryId);
    if (!history) throw new Error("Practice history not found");

    const endedAt = Date.now();
    const startedAt = history.startedAt as number;
    const duration = Math.round((endedAt - startedAt) / 1000);

    await ctx.db.patch(args.practiceHistoryId, {
      endedAt,
      wordsAttempted: args.wordsAttempted,
      wordsCorrect: args.wordsCorrect,
      totalScore: args.totalScore,
      duration,
    });
  },
});

// Get practice history for a session
export const getBySession = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("practiceHistory")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .collect();
  },
});

// Get recent practice stats
export const getRecentStats = query({
  args: {
    sessionId: v.id("sessions"),
    days: v.number(),
  },
  handler: async (ctx, args) => {
    const cutoff = Date.now() - args.days * 24 * 60 * 60 * 1000;

    const history = await ctx.db
      .query("practiceHistory")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    const recent = history.filter((h) => (h.startedAt as number) >= cutoff);

    const byMode: Record<string, { sessions: number; words: number; correct: number }> = {};

    for (const h of recent) {
      const mode = h.mode as string;
      if (!byMode[mode]) {
        byMode[mode] = { sessions: 0, words: 0, correct: 0 };
      }
      byMode[mode].sessions++;
      byMode[mode].words += h.wordsAttempted as number;
      byMode[mode].correct += h.wordsCorrect as number;
    }

    return {
      totalSessions: recent.length,
      totalWordsAttempted: recent.reduce((acc, h) => acc + (h.wordsAttempted as number), 0),
      totalWordsCorrect: recent.reduce((acc, h) => acc + (h.wordsCorrect as number), 0),
      totalDuration: recent.reduce((acc, h) => acc + ((h.duration as number) || 0), 0),
      byMode,
    };
  },
});

// Get daily streak
export const getDailyStreak = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const history = await ctx.db
      .query("practiceHistory")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .collect();

    if (history.length === 0) return { streak: 0, practicedToday: false };

    // Get unique practice days
    const practiceDays = new Set<string>();
    for (const h of history) {
      const date = new Date(h.startedAt as number).toDateString();
      practiceDays.add(date);
    }

    const sortedDays = Array.from(practiceDays).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    const today = new Date().toDateString();
    const practicedToday = sortedDays[0] === today;

    // Calculate streak
    let streak = 0;
    const checkDate = new Date();

    for (const day of sortedDays) {
      const expectedDate = checkDate.toDateString();
      if (day === expectedDate) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return { streak, practicedToday };
  },
});
