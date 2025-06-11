import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.

// Define the schema for the messages table with convex.v since its required by convex.
// Then we define the schemas for inserts, queries, etc with zod since we can then use a
// zod schema to validate the data.

const attachments = defineTable({
  url: v.string(),
  user: v.id("users"),
}).index("by_url", ["url"]);

const messages = defineTable({
  metadata: v.object({
    id: v.string(),
  }),
  text: v.string(),
  attachments: v.array(v.id("attachments")),
  author: v.union(
    v.literal("user"),
    v.literal("system"),
    v.literal("assistant"),
  ),
  thread: v.string(),
})
  .index("by_thread", ["thread"])
  .index("by_metadata_id", ["metadata.id"]);

// Shouldnt have to index by the user since we are using RLS to filter by the user.
const threads = defineTable({
  metadata: v.object({
    id: v.string(),
  }),
  user: v.id("users"),
  streamId: v.optional(v.string()),
  title: v.string(),
  messages: v.array(v.id("messages")),
  pinned: v.boolean(),
})
  .index("by_metadata_id", ["metadata.id"])
  .index("by_pinned", ["pinned"])
  .index("by_title", ["title"]);

export default defineSchema({
  ...authTables,
  messages,
  threads,
  attachments,
});
