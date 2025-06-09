import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { GradientButton } from "./ui/gradient-button";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex w-full items-center justify-center py-4">
          <span className="text-xl font-semibold text-accent relative">
            <Link href="/" className="inset-0 absolute w-full h-full" />
            LH.chat
          </span>
        </div>
        <Link href="/" className="w-full px-2">
          <GradientButton
            wrapperClassName="w-full"
            className="w-full cursor-pointer font-semibold text-sm "
          >
            New Chat
          </GradientButton>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
