import { ConvexClient } from "convex/browser";
import { env } from "@/env";

import { z } from "zod";
import { NextResponse } from "next/server";

const convex = new ConvexClient(env.NEXT_PUBLIC_CONVEX_URL);

const schema = z.object({
  convexSession: z.string(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
      }),
    )
    .optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { error, data } = schema.safeParse(body);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { convexSession, messages = [] } = data;
    console.log(convexSession);

    // const session = await convex.query(api.auth.getSession, {
    //   sessionId: convexSession as Id<"authSessions">,
    // });

    // if (!session) {
    //   return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    // }

    const streamId = crypto.randomUUID();

    // const threadMutation = await convex.mutation(api.threads.createThread, {
    //   userId: session.userId,
    //   streamId,
    //   apiKey: env.API_KEY,
    // });

    // if (threadMutation.error) {
    //   return NextResponse.json(
    //     { error: threadMutation.error },
    //     { status: 500 },
    //   );
    // }

    return new Response("Hello", {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    await convex.close();
  }
}
