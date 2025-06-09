import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatNavButtons } from "@/components/chat-nav-buttons";
import { SidebarButtons } from "@/components/sidebar-buttons";

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
          {children}
        </main>
        <ChatNavButtons />
      </SidebarProvider>
    </>
  );
}
