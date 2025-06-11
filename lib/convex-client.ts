import { ConvexClient } from "convex/browser";
import { env } from "@/env";

export const client = new ConvexClient(env.NEXT_PUBLIC_CONVEX_URL);
