"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface SettingsPageWrapperProps {
  navItems: {
    name: string;
    href: string;
  }[];
  children: React.ReactNode;
}

export default function SettingsPageWrapper({
  children,
  navItems,
}: SettingsPageWrapperProps) {
  return children;

  //i want to make this work better so for now im just not using it
  const pathname = usePathname();
  const prevPathnameRef = useRef<string>("");
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isInitial, setIsInitial] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (isInitial) {
      prevPathnameRef.current = pathname;
      setIsInitial(false);
      return;
    }

    const currentIndex = navItems.findIndex((item) =>
      pathname.includes(item.href),
    );
    const prevIndex = navItems.findIndex((item) =>
      prevPathnameRef.current.includes(item.href),
    );

    if (currentIndex !== -1 && prevIndex !== -1 && currentIndex !== prevIndex) {
      setDirection(currentIndex > prevIndex ? "right" : "left");
    }

    prevPathnameRef.current = pathname;
  }, [pathname, navItems, isInitial]);

  if (prefersReducedMotion) {
    return children;
  }

  return (
    <div className="relative overflow-hidden w-full">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={
            isInitial
              ? { x: 0, opacity: 1 }
              : {
                  x: direction === "right" ? "100%" : "-100%",
                  opacity: 1,
                }
          }
          animate={{ x: 0, opacity: 1 }}
          exit={{
            x: direction === "right" ? "100%" : "-100%",
            opacity: 0,
          }}
          transition={{
            x: {
              type: "spring",
              stiffness: 600,
              damping: 30,
              duration: 0.2,
            },
            opacity: {
              duration: 0.1,
              ease: "easeOut",
            },
          }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
