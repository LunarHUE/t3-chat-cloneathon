"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const navButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:text-foreground",
        secondary: "hover:text-foreground",
        ghost: "hover:text-foreground",
        outline: "hover:text-foreground",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 py-1",
        lg: "h-10 px-6 py-2",
      },
      active: {
        true: "text-secondary-foreground",
        false: "text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "default",
      active: false,
    },
  },
);

interface NavButtonProps
  extends React.ComponentPropsWithoutRef<typeof Link>,
    VariantProps<typeof navButtonVariants> {
  href: string;
}

const NavButtons = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const [dimensions, setDimensions] = React.useState({ width: 0, left: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const buttons = container.querySelectorAll("[data-nav-button]");
    buttons.forEach((button) => {
      const href = button.getAttribute("data-href");
      if (href && pathname.includes(href)) {
        const rect = button.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          left: rect.left - containerRect.left - 6, // Account for container padding
        });
      }
    });
  }, [pathname, children]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "bg-muted w-fit flex gap-2 rounded-lg p-1.5 border relative",
        className,
      )}
      {...props}
    >
      <motion.div
        className="absolute bg-secondary rounded-lg"
        initial={false}
        animate={{
          width: dimensions.width,
          x: dimensions.left,
        }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : {
                type: "spring",
                stiffness: 300,
                damping: 30,
              }
        }
        style={{
          height: "calc(100% - 12px)",
          top: 6,
        }}
      />
      {children}
    </div>
  );
};

const NavButton = React.forwardRef<
  React.ElementRef<typeof Link>,
  NavButtonProps
>(({ className, variant, size, href, ...props }, ref) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isActive = pathname.includes(href);
  const newHref = searchParams.get("rt")
    ? `${href}?rt=${searchParams.get("rt")}`
    : href;
  return (
    <Link
      ref={ref}
      data-href={href}
      href={newHref}
      data-nav-button
      data-active={isActive}
      className={cn(
        navButtonVariants({ variant, size, className, active: isActive }),
        "relative z-10",
      )}
      {...props}
    />
  );
});
NavButton.displayName = "NavButton";

export { NavButtons, NavButton, navButtonVariants };
