import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../../providers/theme-provider";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/signout-button";
import { NavButtons, NavButton } from "@/components/ui/nav-buttons";
import UserAvatar from "@/components/user-avatar";
import MessageUsage from "@/components/message-usage";
import KeyboardShortcuts from "@/components/keyboard-shortcuts";

interface SettingsLayoutProps {
  children: React.ReactNode;
  searchParams?: Promise<{
    rt: string;
  }>;
}

export default async function SettingsLayout({
  children,
  // searchParams,
}: SettingsLayoutProps) {
  // const sp = await searchParams;
  // const { rt } = sp;

  return (
    <main className="p-8 flex flex-col gap-8 mx-auto max-w-screen-xl">
      <div className="flex flex-row justify-between items-center">
        <Button asChild variant="ghost" size="lg">
          <Link href={`/`}>
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to chat</span>
          </Link>
        </Button>
        <div className="flex flex-row gap-2 items-center">
          <ThemeToggle variant="ghost" />
          <SignOutButton />
        </div>
      </div>
      <div className="flex gap-10">
        <div className="w-1/4 flex flex-col gap-6">
          <UserAvatar
            user={{
              name: "John Doe",
              email: "john.doe@example.com",
              image: "https://github.com/shadcn.png",
              subscription: "free",
            }}
          />
          <MessageUsage
            resetsAt={new Date(Date.now() + 1000 * 60 * 60 * 24)}
            standard={{
              usage: 343,
              limit: 1500,
            }}
            premium={{
              usage: 53,
              limit: 100,
            }}
          />
          <KeyboardShortcuts
            shortcuts={[
              {
                name: "Search",
                shortcut: ["Ctrl", "K"],
              },
              {
                name: "New Chat",
                shortcut: ["Ctrl", "Shift", "O"],
              },
              {
                name: "Toggle Sidebar",
                shortcut: ["Ctrl", "B"],
              },
            ]}
          />
        </div>
        <div className="w-3/4 flex flex-col gap-6">
          <NavButtons>
            <NavButton href="/settings/subscription">Subscription</NavButton>
            <NavButton href="/settings/customization">Customization</NavButton>
            <NavButton href="/settings/history">History & Sync</NavButton>
            <NavButton href="/settings/models">Models</NavButton>
            <NavButton href="/settings/api-keys">API Keys</NavButton>
            <NavButton href="/settings/attachments">Attachments</NavButton>
            <NavButton href="/settings/contact">Contact Us</NavButton>
          </NavButtons>
          {children}
        </div>
      </div>
    </main>
  );
}
