import { ThemeToggle } from "../../providers/theme-provider";
import { SignOutButton } from "@/components/signout-button";
import { NavButtons, NavButton } from "@/components/ui/nav-buttons";
import UserAvatar from "@/components/user-avatar";
import MessageUsage from "@/components/message-usage";
import KeyboardShortcuts from "@/components/keyboard-shortcuts";
import SettingsBackButton from "@/components/settings-back-button";
import SettingsPageWrapper from "./settings-page-wrapper";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

type NavItem = {
  name: string;
  href: string;
};

const NavItems: NavItem[] = [
  {
    name: "Subscription",
    href: "/settings/subscription",
  },
  {
    name: "Customization",
    href: "/settings/customization",
  },
  {
    name: "History & Sync",
    href: "/settings/history",
  },
  {
    name: "Models",
    href: "/settings/models",
  },
  {
    name: "API Keys",
    href: "/settings/api-keys",
  },
  {
    name: "Attachments",
    href: "/settings/attachments",
  },
  {
    name: "Contact Us",
    href: "/settings/contact",
  },
];

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  return (
    <main className="min-h-screen background overflow-auto">
      <div className="mx-auto max-w-screen-xl p-8 flex flex-col gap-8 ">
        <div className="flex flex-row justify-between items-center">
          <SettingsBackButton />
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
                subscription: "pro",
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
              {NavItems.map((item) => (
                <NavButton key={item.href} href={item.href}>
                  {item.name}
                </NavButton>
              ))}
            </NavButtons>
            <SettingsPageWrapper navItems={NavItems}>
              {children}
            </SettingsPageWrapper>
          </div>
        </div>
      </div>
    </main>
  );
}
