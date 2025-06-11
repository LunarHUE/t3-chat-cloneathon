import { ChatProvider } from "@/providers/chat-provider";
import ChatInput from "@/components/chat/chat-input";
import type { Id } from "@/convex/_generated/dataModel";
import Messages from "@/components/chat/messages";
import { z } from "zod";

interface ChatPageProps {
  params: Promise<{ threadId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { threadId } = await params;
  const { data, error } = z.string().uuid().safeParse(threadId);
  if (error) {
    return <div>Invalid thread ID</div>;
  }

  return (
    <ChatProvider threadId={data as Id<"threads">}>
      <Messages />
      <ChatInput />
    </ChatProvider>
  );
}
