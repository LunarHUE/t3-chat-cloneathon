import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getSession = query({
  args: {
    sessionId: v.id("authSessions"),
  },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db.get(sessionId);
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});
