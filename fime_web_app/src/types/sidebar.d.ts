interface SidebarData {
  navMain: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
  dashboard: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}
