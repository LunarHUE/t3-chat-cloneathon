"use client";

import { cn } from "@/lib/utils";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";
import { Plus, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function SidebarButtons() {
  const { open } = useSidebar();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const buttonAnimationProps = prefersReducedMotion
    ? {}
    : {
        initial: { x: -40, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -40, opacity: 0 },
        transition: { duration: 0.2, ease: "easeOut" },
      };

  return (
    <div
      className={cn(
        "absolute top-4 left-4 z-20 p-1 transition-all duration-200 ease-in-out flex items-center gap-1 overflow-hidden",
        !open && "bg-sidebar rounded-lg",
      )}
    >
      <SidebarTrigger />
      <AnimatePresence>
        {!open && (
          <>
            <motion.div {...buttonAnimationProps}>
              <Button variant="ghost" size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div {...buttonAnimationProps}>
              <Button
                disabled={pathname === "/"}
                variant="ghost"
                size="icon"
                asChild={pathname !== "/"}
              >
                {pathname === "/" ? (
                  <Plus className="w-4 h-4" />
                ) : (
                  <Link
                    href="/"
                    className={cn(pathname === "/" && "opacity-30")}
                  >
                    <Plus className="w-4 h-4" />
                  </Link>
                )}
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
