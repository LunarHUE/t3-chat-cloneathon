import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.

const messages = defineTable({
  text: v.string(),
  createdAt: v.number(),

})

const threads = defineTable({
  title: v.string(),
  createdAt: v.number(),
  messages: v.array(v.id("messages")),
})

export default defineSchema({
    ...authTables,
    messages,
    threads,
});
