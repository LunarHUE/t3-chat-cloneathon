// in convex/rls.js
import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import {
  Rules,
  wrapDatabaseReader,
  wrapDatabaseWriter,
} from "convex-helpers/server/rowLevelSecurity";
import { DataModel } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";

// We wrap functions in a custom function to apply rls to that function.
// Say we have a public query that returns all threads we want to make sure that
// only the user who created the thread can read and modify it.

// We can then create internal functions that dont apply RLS for stuff like sharing, etc.
async function rlsRules(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  return {
    messages: {
      insert: async (_, message) => {
        const thread = await ctx.db
          .query("threads")
          .withIndex("by_metadata_id", (q) =>
            q.eq("metadata.id", message.thread),
          )
          .first();
        if (!thread) {
          return false;
        }
        return identity !== null && thread.user === identity.subject;
      },
      read: async (_, message) => {
        const thread = await ctx.db
          .query("threads")
          .withIndex("by_metadata_id", (q) =>
            q.eq("metadata.id", message.thread),
          )
          .first();
        if (!thread) {
          return false;
        }
        return identity !== null && thread.user === identity.subject;
      },
      modify: async (_, message) => {
        const thread = await ctx.db
          .query("threads")
          .withIndex("by_metadata_id", (q) =>
            q.eq("metadata.id", message.thread),
          )
          .first();
        if (!thread) {
          return false;
        }
        return identity !== null && thread.user === identity.tokenIdentifier;
      },
    },
    threads: {
      insert: async (_, thread) => {
        // No anon users can create threads, must be logged in
        // return identity !== null;
        // For now, we allow anon users to create threads for dev purposes
        return true;
      },
      read: async (_, thread) => {
        return identity !== null && thread.user === identity.subject;
      },
      modify: async (_, thread) => {
        return identity !== null && thread.user === identity.subject;
      },
    },
    attachments: {
      insert: async (_, attachment) => {
        // No anon users can create threads, must be logged in
        // return identity !== null;
        // For now, we allow anon users to create threads for dev purposes
        return true;
      },
      read: async (_, attachment) => {
        return identity !== null && attachment.user === identity.subject;
      },
      modify: async (_, attachment) => {
        return identity !== null && attachment.user === identity.subject;
      },
    },
  } satisfies Rules<QueryCtx, DataModel>;
}

export const queryWithRLS = customQuery(
  query,
  customCtx(async (ctx) => ({
    db: wrapDatabaseReader(ctx, ctx.db, await rlsRules(ctx)),
  })),
);

export const mutationWithRLS = customMutation(
  mutation,
  customCtx(async (ctx) => ({
    db: wrapDatabaseWriter(ctx, ctx.db, await rlsRules(ctx)),
  })),
);
