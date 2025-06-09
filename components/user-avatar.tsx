"use client";

import Image from "next/image";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UserAvatarProps {
  user: {
    name: string;
    email: string;
    image: string;
    subscription: "free" | "pro" | "enterprise";
  };
}

export default function UserAvatar({ user }: UserAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(user.email);
      toast.success("Copied to clipboard");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy email:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Image
        loading="eager"
        className="object-cover rounded-full"
        src={user.image}
        alt={user.name}
        width={240}
        height={240}
      />
      <p className="text-2xl font-semibold">{user.name}</p>
      <div
        className="relative cursor-pointer select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCopyEmail}
      >
        <div className="overflow-hidden h-6 relative flex justify-center">
          <motion.p
            className="absolute top-0 flex items-center gap-3 text-accent/80"
            initial={false}
            animate={{
              y: isHovered ? -4 : -24,
            }}
          >
            Copy user ID
            {copied ? (
              <Check className="size-5 text-green-500" />
            ) : (
              <Copy className="size-5" />
            )}
          </motion.p>
          <motion.p
            initial={false}
            className="text-accent/80"
            animate={{
              y: isHovered ? -24 : -3,
            }}
          >
            {user.email}
          </motion.p>
        </div>
      </div>
      <Badge
        variant={user.subscription === "free" ? "muted" : "default"}
        className="text-xs text-muted-foreground rounded-full capitalize"
      >
        {user.subscription} Plan
      </Badge>
    </div>
  );
}
