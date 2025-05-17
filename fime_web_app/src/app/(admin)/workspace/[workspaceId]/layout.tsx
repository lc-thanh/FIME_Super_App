import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import "@/app/(admin)/workspace/components/style.css";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar user={user} />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
}
