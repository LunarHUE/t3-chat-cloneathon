"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatEditor } from "../thread/lexical/editor";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/providers/chat-provider";

export default function ChatInput() {
  const ref = useRef<HTMLDivElement>(null);
  const { postMessage } = useChat();
  const [markdownContent, setMarkdownContent] = useState("");
  const [editorMounted, setEditorMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(async () => {
    if (isSubmitting || !markdownContent.trim()) return;
    setIsSubmitting(true);
    const message = {
      text: markdownContent,
      attachments: [],
    };
    console.log("submitting", message);
    setMarkdownContent("");
    await postMessage("test-thread", message);
    setIsSubmitting(false);
  }, [markdownContent, postMessage, isSubmitting]);

  useEffect(() => {
    const currentRef = ref.current;
    // Create a keydown handler that prevents multiple submissions
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    };

    // Add event listener
    if (currentRef) {
      currentRef.addEventListener("keydown", handleKeyDown);
    }

    // Clean up the event listener on component unmount
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [onSubmit]);

  return (
    <div
      className="absolute -bottom-4 right-[50%] translate-x-1/2 mx-auto max-w-2xl w-full"
      ref={ref}
    >
      <ChatEditor
        onMount={() => {
          setEditorMounted(true);
        }}
        loadingComponent={<Skeleton className="w-full h-49" />}
        markdown={markdownContent}
        onMardownContentChange={(content: string) => {
          setMarkdownContent(content);
        }}
      />
      <Button
        disabled={markdownContent.length === 0 || isSubmitting}
        size="icon"
        onClick={onSubmit}
        className={cn(
          "absolute bottom-10 right-4 bg-primary/20",
          !editorMounted && "hidden",
        )}
      >
        <ArrowUp className="size-6" />
      </Button>
    </div>
  );
}
