"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default function SettingsBackButton() {
  const searchParams = useSearchParams();
  const rt = searchParams.get("rt");

  return (
    <Button asChild variant="ghost" size="lg">
      <Link href={rt ? `/chat/${rt}` : "/"}>
        <ArrowLeftIcon className="h-4 w-4" />
        <span>Back to chat</span>
      </Link>
    </Button>
  );
}
