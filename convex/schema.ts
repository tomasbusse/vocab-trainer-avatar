import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Vocabulary trainers created by teachers/admins
  trainers: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.optional(v.string()), // Clerk user ID if logged in
    isPublic: v.boolean(),
    settings: v.object({
      adaptiveDifficulty: v.boolean(),
      pronunciationScoring: v.boolean(),
      allowedModes: v.array(v.string()), // ["conversation", "flashcard", "quiz", "pronunciation"]
    }),
    createdAt: v.number(),
  }).index("by_creator", ["createdBy"]),

  // Word lists belonging to trainers
  wordLists: defineTable({
    trainerId: v.id("trainers"),
    name: v.string(),
    category: v.optional(v.string()),
    difficulty: v.string(), // "beginner", "intermediate", "advanced"
    words: v.array(v.object({
      word: v.string(),
      definition: v.string(),
      pronunciation: v.string(),
      partOfSpeech: v.string(),
      examples: v.array(v.string()),
      synonyms: v.array(v.string()),
      etymology: v.optional(v.string()),
    })),
    isPrebuilt: v.boolean(), // true for pre-built curriculum words
    createdAt: v.number(),
  }).index("by_trainer", ["trainerId"]),

  // Student sessions with unique access tokens
  sessions: defineTable({
    trainerId: v.id("trainers"),
    accessToken: v.string(), // Unique token for URL access
    studentName: v.optional(v.string()),
    studentEmail: v.optional(v.string()),
    clerkUserId: v.optional(v.string()), // If student upgrades to account
    pin: v.optional(v.string()), // Optional PIN protection
    isActive: v.boolean(),
    createdAt: v.number(),
    lastAccessedAt: v.number(),
  })
    .index("by_token", ["accessToken"])
    .index("by_trainer", ["trainerId"])
    .index("by_clerk_user", ["clerkUserId"]),

  // Student progress tracking per word
  progress: defineTable({
    sessionId: v.id("sessions"),
    wordListId: v.id("wordLists"),
    word: v.string(),
    masteryLevel: v.number(), // 0-100
    timesReviewed: v.number(),
    timesCorrect: v.number(),
    lastReviewedAt: v.number(),
    nextReviewAt: v.optional(v.number()), // For spaced repetition
    pronunciationScores: v.array(v.number()),
    avgPronunciationScore: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_session_word", ["sessionId", "word"]),

  // Practice session history
  practiceHistory: defineTable({
    sessionId: v.id("sessions"),
    mode: v.string(), // "conversation", "flashcard", "quiz", "pronunciation"
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    wordsAttempted: v.number(),
    wordsCorrect: v.number(),
    totalScore: v.number(),
    duration: v.optional(v.number()), // in seconds
  }).index("by_session", ["sessionId"]),

  // Conversation logs for avatar interactions
  conversations: defineTable({
    sessionId: v.id("sessions"),
    practiceHistoryId: v.optional(v.id("practiceHistory")),
    messages: v.array(v.object({
      role: v.string(), // "user" | "assistant"
      content: v.string(),
      timestamp: v.number(),
    })),
    createdAt: v.number(),
  }).index("by_session", ["sessionId"]),

  // Pre-built vocabulary curriculum
  curriculum: defineTable({
    name: v.string(),
    description: v.string(),
    level: v.string(), // "beginner", "intermediate", "advanced"
    category: v.string(), // "academic", "business", "daily", "test-prep"
    wordCount: v.number(),
    words: v.array(v.object({
      word: v.string(),
      definition: v.string(),
      pronunciation: v.string(),
      partOfSpeech: v.string(),
      examples: v.array(v.string()),
      synonyms: v.array(v.string()),
      etymology: v.optional(v.string()),
    })),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_level", ["level"]).index("by_category", ["category"]),
});
