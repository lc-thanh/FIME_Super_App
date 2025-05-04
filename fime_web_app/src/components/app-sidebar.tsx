"use client";

import * as React from "react";
import { SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { User } from "next-auth";
import { NavProjects } from "@/components/nav-projects";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Tasks",
          url: "/dashboard/task",
        },
        {
          title: "Users",
          url: "/dashboard/user",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
  ],
  projects: [],
} as SidebarData;

export function AppSidebar({
  user,
  workspaces,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: Pick<User, "fullname" | "email" | "image"> | undefined;
  workspaces: SidebarWorkspaceData[];
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={workspaces} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
