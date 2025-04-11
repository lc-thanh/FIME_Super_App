import ActionSearchBar from "@/components/action-search-bar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
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
        <main className="flex h-fit w-full overflow-hidden p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
