"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { Doc, type Id, type TableNames } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { toast } from "sonner";

type Message = Omit<Doc<"messages">, "_id" | "_creationTime" | "thread">;
type PostMessage = Omit<Message, "author">;

export interface ChatContextType {
  messages: Doc<"messages">[];
  incomingMessage: string;
  setMessages: (messages: Doc<"messages">[]) => void;
  setIncomingMessage: (message: string) => void;
  postMessage: (threadId: string, message: PostMessage) => Promise<void>;
  resumeChat: (streamId: string, messageId: string) => Promise<void>;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({
  children,
  threadId,
}: {
  children: ReactNode;
  threadId?: Id<"threads">;
}) {
  // const data = useQuery(api.messages.getMessagesInThread, {
  //   threadId,
  // });
  const [messages, setMessages] = useState<Doc<"messages">[]>([]);
  const [incomingMessage, setIncomingMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const postMessage = useCallback(
    async (threadId: string, message: PostMessage) => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            convexSession: "TEST",
            messages: [
              ...messages.map((msg) => ({
                role:
                  msg.author === "model"
                    ? "assistant"
                    : msg.author === "system"
                      ? "system"
                      : "user",
                content: msg.text,
              })),
              {
                role: "user",
                content: message.text,
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Add user message to local state
        const userMessage: Doc<"messages"> = {
          ...message,
          author: "user" as Id<"users">,
          thread: threadId as Id<"threads">,
          _id: "NewMessage" as Id<"messages">,
          _creationTime: Date.now(),
        };
        setMessages((prev) => [...prev, userMessage]);

        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        const assistantMessage = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("0:")) {
                try {
                  const data = JSON.parse(line.slice(2));
                  setIncomingMessage((prev) => prev + data);
                } catch (e) {
                  console.error(e);
                  // Ignore parsing errors for incomplete chunks
                }
              }
            }
          }
        }

        // Add final assistant message to state
        if (assistantMessage) {
          const finalAssistantMessage: Doc<"messages"> = {
            text: assistantMessage,
            attachments: [],
            author: "model",
            thread: threadId as Id<"threads">,
            _id: "NewMessage" as Id<"messages">,
            _creationTime: Date.now(),
          };
          setMessages((prev) => [...prev, finalAssistantMessage]);
          setIncomingMessage("");
        }
      } catch (error) {
        console.error("Error posting message:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [messages],
  );

  const resumeChat = useCallback(
    async (streamId: string, messageId: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/chat/resume?streamId=${streamId}&convexSession=${"test"}&messageId=${messageId}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let resumedMessage = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("0:")) {
                try {
                  const data = JSON.parse(line.slice(2));
                  if (data.type === "text-delta") {
                    resumedMessage += data.textDelta;
                    setIncomingMessage(resumedMessage);
                  }
                } catch (e) {
                  console.error(e);
                  // Ignore parsing errors for incomplete chunks
                }
              }
            }
          }
        }

        // Update the existing message or add as new message
        if (resumedMessage) {
          setIncomingMessage("");
          // You might want to update an existing message here based on messageId
          // For now, we'll treat it as a new message
          const resumedAssistantMessage: Doc<"messages"> = {
            text: resumedMessage,
            attachments: [],
            author: "model",
            thread: threadId as Id<"threads">,
            _id: "NewMessage" as Id<"messages">,
            _creationTime: Date.now(),
          };
          setMessages((prev) => [...prev, resumedAssistantMessage]);
        }
      } catch (error) {
        console.error("Error resuming chat:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const value: ChatContextType = {
    messages,
    incomingMessage,
    setMessages,
    setIncomingMessage,
    postMessage,
    resumeChat,
    isLoading,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
