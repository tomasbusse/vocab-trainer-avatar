import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const wordSchema = v.object({
  word: v.string(),
  definition: v.string(),
  pronunciation: v.string(),
  partOfSpeech: v.string(),
  examples: v.array(v.string()),
  synonyms: v.array(v.string()),
  etymology: v.optional(v.string()),
});

// Create a new word list for a trainer
export const create = mutation({
  args: {
    trainerId: v.id("trainers"),
    name: v.string(),
    category: v.optional(v.string()),
    difficulty: v.string(),
    words: v.array(wordSchema),
    isPrebuilt: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("wordLists", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get word lists for a trainer
export const getByTrainer = query({
  args: { trainerId: v.id("trainers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("wordLists")
      .withIndex("by_trainer", (q) => q.eq("trainerId", args.trainerId))
      .collect();
  },
});

// Get a single word list
export const get = query({
  args: { id: v.id("wordLists") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Add words to an existing list
export const addWords = mutation({
  args: {
    wordListId: v.id("wordLists"),
    words: v.array(wordSchema),
  },
  handler: async (ctx, args) => {
    const list = await ctx.db.get(args.wordListId);
    if (!list) throw new Error("Word list not found");

    await ctx.db.patch(args.wordListId, {
      words: [...list.words, ...args.words],
    });
  },
});

// Remove a word from a list
export const removeWord = mutation({
  args: {
    wordListId: v.id("wordLists"),
    word: v.string(),
  },
  handler: async (ctx, args) => {
    const list = await ctx.db.get(args.wordListId);
    if (!list) throw new Error("Word list not found");

    await ctx.db.patch(args.wordListId, {
      words: list.words.filter((w) => w.word !== args.word),
    });
  },
});

// Get random words from a list for practice
export const getRandomWords = query({
  args: {
    wordListId: v.id("wordLists"),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const list = await ctx.db.get(args.wordListId);
    if (!list) return [];

    const shuffled = [...list.words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, args.count);
  },
});
