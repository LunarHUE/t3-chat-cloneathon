import { z } from "zod";
import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { StreamManager } from "../_lib/streaming";
import { client } from "@/lib/convex-client";

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

    const result = streamText({
      model: openai("gpt-4o"),
      messages,
    });
    const streamManager = StreamManager.getInstance();
    streamManager.addStream(streamId, result, "test-thread-id");
    return result.toDataStreamResponse({
      headers: {
        "x-stream-id": streamId,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
