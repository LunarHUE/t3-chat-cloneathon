import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";
import { queryWithRLS } from "./rls";
import { paginationOptsValidator } from "convex/server";

// since this is a query that will be made on the client we shouldnt need to pass the convex
// session in, RLS should handle that with the identity lookup. So in theory user should always defined
// in these functions.
export const getThreads = queryWithRLS({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const threads = await ctx.db
      .query("threads")
      .order("desc")
      .paginate(paginationOpts);

    return {
      data: threads,
      error: null,
    };
  },
});

export const getThreadById = queryWithRLS({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, { threadId }) => {
    const thread = await ctx.db
      .query("threads")
      .withIndex("by_metadata_id", (q) => q.eq("metadata.id", threadId))
      .first();
    return {
      data: thread,
      error: null,
    };
  },
});

// On these internal mutations we will pass the userId to the functions,
// so in our endpoints we will check the auth sessions to make sure they are authed before calling these functions.

export const updateThread = internalMutation({
  args: {
    threadId: v.string(),
    title: v.optional(v.string()),
    pinned: v.optional(v.boolean()),
    messages: v.optional(v.array(v.id("messages"))),
    streamId: v.optional(v.string()),
  },
  handler: async (ctx, { threadId, title, pinned, messages, streamId }) => {
    const thread = await ctx.db
      .query("threads")
      .withIndex("by_metadata_id", (q) => q.eq("metadata.id", threadId))
      .first();
    if (!thread) {
      return {
        data: null,
        error: "Thread not found",
      };
    }

    await ctx.db.patch(thread._id, {
      title,
      pinned,
      messages,
      streamId,
    });

    return {
      data: threadId,
      error: null,
    };
  },
});

export const createThread = mutation({
  args: {
    threadId: v.string(),
    userId: v.id("users"),
    streamId: v.string(),
    apiKey: v.string(),
  },
  handler: async (ctx, { threadId, userId, streamId, apiKey }) => {
    if (apiKey !== process.env.API_KEY) {
      return {
        data: null,
        error: "Invalid API key",
      };
    }

    const thread = {
      metadata: { id: threadId },
      title: "New Thread",
      messages: [],
      user: userId,
      pinned: false,
      streamId,
    };

    await ctx.db.insert("threads", thread);
    return {
      data: thread,
      error: null,
    };
  },
});

export const deleteThread = internalMutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, { threadId }) => {
    const thread = await ctx.db
      .query("threads")
      .withIndex("by_metadata_id", (q) => q.eq("metadata.id", threadId))
      .first();
    if (!thread) {
      return {
        data: null,
        error: "Thread not found",
      };
    }

    await ctx.db.delete(thread._id);

    return {
      data: threadId,
      error: null,
    };
  },
});
