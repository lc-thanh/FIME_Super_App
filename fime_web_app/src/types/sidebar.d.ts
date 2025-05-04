interface SidebarWorkspaceData {
  name: string;
  url: string;
}

interface SidebarData {
  navMain: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  projects: SidebarWorkspaceData[];
}
