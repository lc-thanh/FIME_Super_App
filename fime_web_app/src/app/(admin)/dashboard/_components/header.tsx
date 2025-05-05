"use client";

import ActionSearchBar from "@/components/action-search-bar";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="flex sticky top-0 h-14 shrink-0 items-center gap-2 border-b px-4 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-row w-full justify-content-start items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <span>{pathname}</span>
      </div>
      <div className="flex flex-row gap-2">
        <ActionSearchBar />
        <ModeToggle />
      </div>
    </header>
  );
};
