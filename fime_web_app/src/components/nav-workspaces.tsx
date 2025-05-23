"use client";

import type React from "react";

import {
  Frame,
  MoreHorizontal,
  Plus,
  Trash2,
  Check,
  X,
  Link as LinkIcon,
  Pencil,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  MY_WORKSPACES_QUERY_KEY,
  myWorkspacesQueryOptions,
} from "@/queries/workspace-query";
import { WorkspaceApiRequest } from "@/requests/workspace.request";
import { toast } from "sonner";
import { DeleteWorkspaceDialog } from "@/components/delete-workspace-dialog";
import { useUserRoleStore } from "@/providers/user-role-provider";

interface WorkspaceUrl {
  id: string;
  name: string;
  url: string;
}

export function NavWorkspaces() {
  const { isAdmin } = useUserRoleStore((state) => state);
  const queryClient = useQueryClient();
  const { isMobile } = useSidebar();
  const [isCreating, setIsCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [renamingWorkspaceId, setRenamingWorkspaceId] = useState<string | null>(
    null
  );
  const [editedWorkspaceName, setEditedWorkspaceName] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  const { data: workspaces } = useSuspenseQuery(myWorkspacesQueryOptions());
  const workspace_urls: WorkspaceUrl[] = workspaces.map((workspace) => ({
    id: workspace.id,
    name: workspace.name,
    url: `/workspace/${workspace.id}`,
  }));

  const addingMutation = useMutation({
    mutationFn: async (name: string) => {
      await WorkspaceApiRequest.createWorkspace(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_WORKSPACES_QUERY_KEY] });
      toast.success("Tạo Workspace mới thành công");
      setIsCreating(false);
      setNewWorkspaceName("");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra!");
    },
  });

  const renamingMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      await WorkspaceApiRequest.renameWorkspace(id, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_WORKSPACES_QUERY_KEY] });
      toast.success("Đổi tên workspace thành công");
      setRenamingWorkspaceId(null);
      setEditedWorkspaceName("");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra!");
    },
  });

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  useEffect(() => {
    if (renamingWorkspaceId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingWorkspaceId]);

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim()) {
      addingMutation.mutate(newWorkspaceName.trim());
    } else {
      toast.error("Tên workspace không được để trống");
    }
  };

  const handleRenameWorkspace = () => {
    if (editedWorkspaceName.trim() && renamingWorkspaceId) {
      renamingMutation.mutate({
        id: renamingWorkspaceId,
        name: editedWorkspaceName.trim(),
      });
    } else {
      toast.error("Tên workspace không được để trống");
      cancelRenaming();
    }
  };

  const startRenaming = (workspace: WorkspaceUrl) => {
    setRenamingWorkspaceId(workspace.id);
    setEditedWorkspaceName(workspace.name);
  };

  const cancelRenaming = () => {
    setRenamingWorkspaceId(null);
    setEditedWorkspaceName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, isRenaming = false) => {
    if (e.key === "Enter") {
      if (isRenaming) {
        handleRenameWorkspace();
      } else {
        handleCreateWorkspace();
      }
    } else if (e.key === "Escape") {
      if (isRenaming) {
        cancelRenaming();
      } else {
        setIsCreating(false);
        setNewWorkspaceName("");
      }
    }
  };

  const handleShareWorkspace = (workspaceUrl: string) => {
    const shareableLink = `${window.location.origin}${workspaceUrl}`;
    navigator.clipboard.writeText(shareableLink);
    toast.success("Đã sao chép liên kết workspace vào clipboard");
  };

  const handleDeleteWorkspace = (workspace: { id: string; name: string }) => {
    setSelectedWorkspace(workspace);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Công việc</SidebarGroupLabel>
        <SidebarMenu>
          {workspace_urls.map((item) => (
            <SidebarMenuItem key={item.name}>
              {renamingWorkspaceId === item.id ? (
                <div className="flex items-center gap-1">
                  <Input
                    ref={renameInputRef}
                    value={editedWorkspaceName}
                    onChange={(e) => setEditedWorkspaceName(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, true)}
                    placeholder="Tên workspace"
                    className="h-7 text-sm"
                  />
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={handleRenameWorkspace}
                      disabled={renamingMutation.isPending}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={cancelRenaming}
                      disabled={renamingMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <Frame />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-fit rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      {/* <DropdownMenuItem asChild>
                        <Link href={item.url}>
                          <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>View Project</span>
                        </Link>
                      </DropdownMenuItem> */}
                      <DropdownMenuItem
                        onClick={() => handleShareWorkspace(item.url)}
                      >
                        <LinkIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Lấy link</span>
                      </DropdownMenuItem>
                      {isAdmin() && (
                        <>
                          <DropdownMenuItem onClick={() => startRenaming(item)}>
                            <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Đổi tên</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteWorkspace({
                                id: item.id,
                                name: item.name,
                              })
                            }
                            className="text-nowrap text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Xóa Workspace</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </SidebarMenuItem>
          ))}
          {isAdmin() && (
            <SidebarMenuItem>
              {isCreating ? (
                <div className="flex items-center gap-1">
                  <Input
                    ref={inputRef}
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tên workspace"
                    className="h-7 text-sm"
                  />
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={handleCreateWorkspace}
                      disabled={addingMutation.isPending}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => {
                        setIsCreating(false);
                        setNewWorkspaceName("");
                      }}
                      disabled={addingMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <SidebarMenuButton
                  onClick={() => setIsCreating(true)}
                  className="text-sidebar-foreground/70"
                >
                  <Plus className="text-sidebar-foreground/70" />
                  <span>Mới</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>

      {selectedWorkspace && (
        <DeleteWorkspaceDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          workspaceId={selectedWorkspace.id}
          workspaceName={selectedWorkspace.name}
        />
      )}
    </>
  );
}
