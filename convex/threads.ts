import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getThreads = query({
    handler: async (ctx) => {
        const threads = await ctx.db.query("threads").collect();
        return threads;
    }
})

export const createThread = mutation({
    args: {
        title: v.string(), 
    }, handler: async (ctx, { title }) => {
        const thread = await ctx.db.insert("threads", {
            title,
            createdAt: Date.now(),
            messages: [],
        });
        return thread;
    }
})

