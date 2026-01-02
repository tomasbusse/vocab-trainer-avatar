import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate a unique access token
function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Create a new student session with unique token
export const create = mutation({
  args: {
    trainerId: v.id("trainers"),
    studentName: v.optional(v.string()),
    studentEmail: v.optional(v.string()),
    pin: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const accessToken = generateToken();
    const now = Date.now();

    const sessionId = await ctx.db.insert("sessions", {
      trainerId: args.trainerId,
      accessToken,
      studentName: args.studentName,
      studentEmail: args.studentEmail,
      pin: args.pin,
      isActive: true,
      createdAt: now,
      lastAccessedAt: now,
    });

    return { sessionId, accessToken };
  },
});

// Get session by access token (for URL-based access)
export const getByToken = query({
  args: { accessToken: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("accessToken", args.accessToken))
      .first();

    if (!session) return null;

    // Get the trainer info
    const trainer = await ctx.db.get(session.trainerId);

    return { session, trainer };
  },
});

// Verify session PIN
export const verifyPin = query({
  args: {
    accessToken: v.string(),
    pin: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("accessToken", args.accessToken))
      .first();

    if (!session) return { valid: false, error: "Session not found" };
    if (!session.pin) return { valid: true }; // No PIN required

    return { valid: session.pin === args.pin };
  },
});

// Update last accessed time
export const updateAccess = mutation({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      lastAccessedAt: Date.now(),
    });
  },
});

// Upgrade session to Clerk account
export const upgradeToAccount = mutation({
  args: {
    sessionId: v.id("sessions"),
    clerkUserId: v.string(),
    studentName: v.optional(v.string()),
    studentEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      clerkUserId: args.clerkUserId,
      studentName: args.studentName,
      studentEmail: args.studentEmail,
    });
  },
});

// List sessions for a trainer
export const listByTrainer = query({
  args: { trainerId: v.id("trainers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .withIndex("by_trainer", (q) => q.eq("trainerId", args.trainerId))
      .collect();
  },
});

// Get sessions for a Clerk user (for account holders)
export const getByClerkUser = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", args.clerkUserId))
      .collect();
  },
});
