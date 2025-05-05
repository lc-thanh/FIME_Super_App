import { Header } from "@/app/(admin)/dashboard/_components/header";
import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
        <Header />
        <main className="flex w-full p-4 pt-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
