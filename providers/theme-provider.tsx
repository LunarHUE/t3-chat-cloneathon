"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { Button, type buttonVariants } from "../components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "../hooks/use-reduced-motion";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

interface ThemeToggleProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {}

export function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // courtesy of https://medium.com/@AkashHamirwasia/full-page-theme-toggle-animation-with-view-transitions-api-43db0beed341
  const toggleDarkMode = async (theme: string) => {
    if (
      !ref.current ||
      !document.startViewTransition ||
      prefersReducedMotion
    ) {
      setTheme(theme);
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(theme);
      });
    }).ready;

    const { top, left, width, height } = ref.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRadius = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      onClick={() => toggleDarkMode(theme === "dark" ? "light" : "dark")}
      className={cn("cursor-pointer", className)}
      ref={ref}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!theme ? (
          <motion.svg
            key="loading"
            className="size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, rotate: 90 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </motion.svg>
        ) : theme === "dark" ? (
          <motion.svg
            key="sun"
            className="size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, rotate: 90, scale: 0.6 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: "easeInOut" }}
          >
            <circle cx="12" cy="12" r="5" />
            <motion.g
              initial={{ rotate: 0 }}
              animate={prefersReducedMotion ? { rotate: 0 } : { rotate: 360 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </motion.g>
          </motion.svg>
        ) : (
          <motion.svg
            key="moon"
            className="size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, rotate: 90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, rotate: -90, scale: 0.6 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: "easeInOut" }}
          >
            <motion.path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: "easeInOut" }}
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </Button>
  );
}
