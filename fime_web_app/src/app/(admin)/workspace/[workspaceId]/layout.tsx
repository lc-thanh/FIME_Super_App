import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WorkspaceApiRequest } from "@/requests/workspace.request";
import "@/app/(admin)/workspace/components/style.css";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  const workspaces = await WorkspaceApiRequest.myWorkspaces();

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar user={user} workspaces={workspaces || []} />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
}
