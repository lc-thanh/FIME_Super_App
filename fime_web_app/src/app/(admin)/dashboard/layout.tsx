import { auth } from "@/auth";
import ActionSearchBar from "@/components/action-search-bar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { WorkspaceApiRequest } from "@/requests/workspace.request";
import { cookies } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const session = await auth();
  const user = session?.user;

  const workspaces = await WorkspaceApiRequest.myWorkspaces();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={user} workspaces={workspaces || []} />
      <SidebarInset>
        <header className="flex flex-row w-full justify-content-evenly pe-4 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex flex-row w-full justify-content-start items-center gap-2 px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <ActionSearchBar />
          </div>
          <div>
            <ModeToggle />
          </div>
        </header>
        <main className="flex w-full p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
