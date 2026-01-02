import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new vocabulary trainer
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.optional(v.string()),
    isPublic: v.boolean(),
    settings: v.object({
      adaptiveDifficulty: v.boolean(),
      pronunciationScoring: v.boolean(),
      allowedModes: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const trainerId = await ctx.db.insert("trainers", {
      ...args,
      createdAt: Date.now(),
    });
    return trainerId;
  },
});

// Get trainer by ID
export const get = query({
  args: { id: v.id("trainers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// List trainers by creator
export const listByCreator = query({
  args: { createdBy: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("trainers")
      .withIndex("by_creator", (q) => q.eq("createdBy", args.createdBy))
      .collect();
  },
});

// List public trainers
export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const trainers = await ctx.db.query("trainers").collect();
    return trainers.filter((t) => t.isPublic);
  },
});

// Update trainer settings
export const updateSettings = mutation({
  args: {
    id: v.id("trainers"),
    settings: v.object({
      adaptiveDifficulty: v.boolean(),
      pronunciationScoring: v.boolean(),
      allowedModes: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { settings: args.settings });
  },
});
