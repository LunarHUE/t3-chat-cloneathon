"use client";

import { Settings2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeToggle } from "@/providers/theme-provider";
import { useSidebar } from "@/components/ui/sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ChatNavButtons() {
  const { open } = useSidebar();
  const prefersReducedMotion = useReducedMotion();

  const backgroundAnimationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration: 0.15, ease: "easeInOut" },
      };

  return (
    <div className="absolute top-[1rem] right-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={open ? "open" : "closed"}
          className={
            open
              ? "absolute top-0 right-[-8px] px-2 bg-sidebar border-b border-l rounded-bl-2xl border-border/60"
              : "absolute top-0 right-0 px-0 bg-sidebar rounded-xl border-border/60"
          }
          {...backgroundAnimationProps}
        >
          <div className="flex flex-row gap-2 items-center px-2 py-1 relative z-20">
            <Button
              className={open ? "rounded-bl-xl" : ""}
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href="/settings">
                <Settings2 className="w-4 h-4" />
              </Link>
            </Button>
            <ThemeToggle variant="ghost" />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
