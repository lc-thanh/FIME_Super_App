"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { WorkspaceApiRequest } from "@/requests/workspace.request";
import {
  MY_WORKSPACES_QUERY_KEY,
  WORKSPACE_QUERY_KEY,
  workspaceQueryOptions,
} from "@/queries/workspace-query";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";

interface WorkspaceTitleProps {
  workspaceId: string;
  className?: string;
}

export default function WorkspaceTitle({
  workspaceId,
  className = "",
}: WorkspaceTitleProps) {
  const queryClient = useQueryClient();
  const { data: workspace } = useSuspenseQuery(
    workspaceQueryOptions(workspaceId)
  );

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(workspace.name);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const mutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      await WorkspaceApiRequest.renameWorkspace(id, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_WORKSPACES_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [WORKSPACE_QUERY_KEY, workspaceId],
      });
      toast.success("Đổi tên workspace thành công");
      setIsEditing(false);
    },
    onError: (error) => {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra!",
      });
    },
  });

  const handleSave = () => {
    mutation.mutate({
      id: workspaceId,
      name: title,
    });
  };

  const handleCancel = () => {
    setTitle(workspace.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-white/20 text-white border border-white/30 rounded px-2 py-1 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Edit title"
        />
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-white hover:bg-white/20"
            onClick={handleSave}
            aria-label="Save"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-white hover:bg-white/20"
            onClick={handleCancel}
            aria-label="Cancel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <h1
      className={`text-xl text-white font-bold tracking-tight first:mt-0 cursor-pointer hover:underline ${className}`}
      onClick={() => setIsEditing(true)}
    >
      {title}
    </h1>
  );
}
