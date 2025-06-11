import ChatInput from '@/components/chat/chat-input';
import Messages from "@/components/chat/messages";

export default function Home() {
  return (
    <main className="w-full mx-auto max-w-2xl h-screen py-10">
      <Messages />
      <ChatInput />
    </main>
  );
}
