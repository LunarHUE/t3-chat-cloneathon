import { v } from "convex/values";
import { queryWithRLS } from "./rls";

export const getMessagesInThread = queryWithRLS({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, { threadId }) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_thread", (q) => q.eq("thread", threadId))
      .order("asc")
      .collect();

    return {
      data: messages,
      error: null,
    };
  },
});
