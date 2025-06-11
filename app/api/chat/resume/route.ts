import { NextResponse } from "next/server";
import { StreamManager } from "../../_lib/streaming";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const streamId = searchParams.get("streamId");
  const convexSession = searchParams.get("convexSession");

  if (!streamId || !convexSession) {
    return NextResponse.json(
      { error: "Stream ID and convexSession are required" },
      { status: 400 },
    );
  }

  // const session = await convex.query(api.auth.getSession, {
  //   sessionId: convexSession as Id<"authSessions">,
  // });

  // if (!session) {
  //   return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  // }

  const streamManager = StreamManager.getInstance();
  const result = streamManager.getStream(streamId);
  console.log("RESUME,", streamManager.getStreamMap().keys());
  if (!result) {
    return NextResponse.json({ error: "Stream not found" }, { status: 404 });
  }

  return result.stream.toDataStreamResponse();
}
