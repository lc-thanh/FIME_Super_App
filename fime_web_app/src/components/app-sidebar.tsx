"use client";

import * as React from "react";
import { Calendar, LayoutPanelLeft, PanelsTopLeft, Users } from "lucide-react";

import { DashboardNav } from "@/components/dashboard-nav";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  // SidebarRail,
} from "@/components/ui/sidebar";
import { User } from "next-auth";
import { NavWorkspaces } from "@/components/nav-workspaces";
import { NavMain } from "@/components/nav-main";
import { ScrollArea } from "@/components/ui/scroll-area";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Trang chủ",
      url: "/dashboard",
      icon: LayoutPanelLeft,
    },
    {
      title: "Lịch làm việc",
      url: "/dashboard/schedule",
      icon: Calendar,
    },
  ],
  dashboard: [
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
          title: "Ban",
          url: "/dashboard/teams",
        },
        {
          title: "Chức vụ",
          url: "/dashboard/positions",
        },
        {
          title: "Gen",
          url: "/dashboard/gens",
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
          url: "/dashboard/newest-products",
        },
      ],
    },
  ],
} as SidebarData;

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: Pick<User, "fullname" | "email" | "image"> | undefined;
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea>
          <NavMain items={data.navMain} />
          <DashboardNav items={data.dashboard} />
          <NavWorkspaces />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
