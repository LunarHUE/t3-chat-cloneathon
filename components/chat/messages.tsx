"use client";

import { useChat } from "@/providers/chat-provider";

export default function Messages() {
  const { messages, incomingMessage } = useChat();
  console.log("incomingMessage", incomingMessage);
  console.log(messages);
  return (
    <div className="flex">
      <div className="flex-1">
        {messages.map((message) => (
          <div key={message._id}>{message.text}</div>
        ))}
        {incomingMessage && (
          <div className="text-sm text-gray-500">{incomingMessage}</div>
        )}
      </div>
    </div>
  );
}
