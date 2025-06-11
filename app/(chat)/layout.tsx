import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatNavButtons } from "@/components/chat-nav-buttons";
import { SidebarButtons } from "@/components/sidebar-buttons";
import ChatInput from "@/components/chat/chat-input";
import { ChatProvider } from "@/providers/chat-provider";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider>
        <SidebarButtons />
        <AppSidebar />
        <main className="flex flex-col h-screen w-full bg-chat-background border-chat-border border rounded-tl-xl relative">
          <ChatProvider>
            {children}
            <ChatInput />
          </ChatProvider>
        </main>
        <ChatNavButtons />
      </SidebarProvider>
    </>
  );
}
