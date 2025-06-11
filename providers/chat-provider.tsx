"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

type Message = Omit<Doc<"messages">, "_id">;
type PostMessage = Omit<Message, "author" | "_creationTime" | "thread">;

export interface ChatContextType {
  messages: Message[];
  postMessage: (threadId: string, message: PostMessage) => Promise<void>;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({
  children,
  threadId,
}: {
  children: ReactNode;
  threadId: string;
}) {
  const queryResult = useQuery(api.messages.getMessagesInThread, {
    threadId,
  });
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const messages = useMemo(() => {
    if (!queryResult) return optimisticMessages;

    const filteredOptimistic = optimisticMessages.filter(
      (optMsg) =>
        !queryResult.data.some(
          (realMsg) =>
            realMsg.author === optMsg.author &&
            realMsg.metadata.id === optMsg.metadata.id &&
            Math.abs(realMsg._creationTime - optMsg._creationTime) < 10000,
        ),
    );

    return [...queryResult.data, ...filteredOptimistic].sort(
      (a, b) => a._creationTime - b._creationTime,
    );
  }, [queryResult, optimisticMessages]);

  const postMessage = useCallback(
    async (threadId: string, message: PostMessage) => {
      setIsLoading(true);
      try {
        const optimisticUserMessage: Message = {
          ...message,
          author: "user",
          thread: threadId,
          _creationTime: Date.now(),
        };
        setOptimisticMessages((prev) => [...prev, optimisticUserMessage]);
        const nextMessageId = crypto.randomUUID();
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            convexSession: "TEST",
            messages: [
              ...messages.map((msg) => ({
                role: msg.author,
                content: msg.text,
              })),
              {
                role: "user",
                content: message.text,
              },
            ],
            nextMessageId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
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
                  setOptimisticMessages((prev) => {
                    const existingAssistantMessage = prev.find(
                      (msg) =>
                        msg.author === "assistant" &&
                        msg.metadata.id === `${nextMessageId}`,
                    );

                    if (existingAssistantMessage) {
                      return prev.map((msg) =>
                        msg.metadata.id === `${nextMessageId}`
                          ? {
                              ...msg,
                              text: msg.text + data,
                            }
                          : msg,
                      );
                    }
                    return [
                      ...prev,
                      {
                        text: data,
                        attachments: [],
                        author: "assistant",
                        thread: threadId,
                        metadata: { id: `${nextMessageId}` },
                        _creationTime: Date.now(),
                      },
                    ];
                  });
                } catch (e) {
                  console.error(e);
                }
              }
            }
          }
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

  useEffect(() => {
    if (queryResult) {
      setOptimisticMessages((prev) =>
        prev.filter(
          (optMsg) =>
            !queryResult.data.some(
              (realMsg) =>
                realMsg.author === optMsg.author &&
                Math.abs(realMsg._creationTime - optMsg._creationTime) < 5000 &&
                realMsg.text === optMsg.text,
            ),
        ),
      );
    }
  }, [queryResult]);

  const value: ChatContextType = {
    messages,
    postMessage,
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
