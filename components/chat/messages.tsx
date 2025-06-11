"use client";

import { useChat } from "@/providers/chat-provider";

export default function Messages() {
  const { messages } = useChat();
  console.log(messages);
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 pb-10 pt-10">
      {messages.map((message) => {
        if (message.author === "user") {
          return <UserMessage key={message.metadata.id} message={message} />;
        } else if (message.author === "assistant") {
          return (
            <AssistantMessage key={message.metadata.id} message={message} />
          );
        }
        return null;
      })}
    </div>
  );
}

interface MessageType {
  text: string;
  author: "user" | "assistant" | "system";
}

function UserMessage({ message }: { message: MessageType }) {
  return (
    <div className="flex w-full justify-end">
      <div className="group relative inline-block max-w-[80%] break-words rounded-xl border border-secondary/50 bg-secondary/50 px-4 py-3 text-left">
        {message.text}
      </div>
    </div>
  );
}

function AssistantMessage({ message }: { message: MessageType }) {
  return (
    <div className="flex w-full justify-start">
      <div className="group relative w-full max-w-full break-words">
        {/* <Thinking></Thinking> */}
        <div className="prose prose-pink max-w-none dark:prose-invert prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
          {message.text}
        </div>
      </div>
    </div>
  );
}
