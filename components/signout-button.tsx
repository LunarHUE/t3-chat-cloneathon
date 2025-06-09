"use client";

import { Button, type buttonVariants } from "./ui/button";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface SignOutButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {}

export function SignOutButton({ className, ...props }: SignOutButtonProps) {
  const signOut = () => {
    console.log("signing out");
  };

  return (
    <Button
      variant="ghost"
      onClick={() => signOut()}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      Sign Out
    </Button>
  );
}
