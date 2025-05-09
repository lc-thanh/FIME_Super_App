"use client";

import * as React from "react";
import { PanelsTopLeft, Users } from "lucide-react";

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
      title: "Quản lý nhân sự",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Thành viên",
          url: "/dashboard/users",
        },
        {
          title: "Quản lý Ban",
          url: "/dashboard/teams",
        },
        {
          title: "Quản lý Chức vụ",
          url: "#",
        },
      ],
    },
    {
      title: "Chỉnh sửa Website",
      url: "#",
      icon: PanelsTopLeft,
      items: [
        {
          title: "Ấn phẩm mới nhất",
          url: "/dashboard/latest-publication",
        },
        {
          title: "Sản phẩm gần đây",
          url: "#",
        },
      ],
    },
  ],
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
