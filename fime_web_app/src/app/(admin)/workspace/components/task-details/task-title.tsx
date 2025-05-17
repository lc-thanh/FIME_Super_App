"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, SquarePen, X } from "lucide-react";
import { FimeTitle } from "@/components/fime-title";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TASK_ACTIVITIES_QUERY_KEY,
  TASK_QUERY_KEY,
} from "@/queries/task-query";
import { TaskApiRequests } from "@/requests/task.request";
import { toast } from "sonner";

interface TaskTitleProps {
  initialTitle: string;
  taskId: string;
  className?: string;
}

export default function TaskTitle({
  initialTitle = "Card Title",
  taskId,
  className = "",
}: TaskTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [editedTitle, setEditedTitle] = useState(initialTitle);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newTitle: string) => {
      await TaskApiRequests.changeTitle(taskId, newTitle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, taskId] });
      queryClient.invalidateQueries({
        queryKey: [TASK_ACTIVITIES_QUERY_KEY],
      });
      setTitle(editedTitle);
      setIsEditing(false);
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, taskId] });
      toast.error("Có lỗi xảy ra!");
    },
  });

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      setEditedTitle(title);
    }
  };

  const handleSave = () => {
    if (editedTitle.trim() === "") return;
    mutation.mutate(editedTitle);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
      e.preventDefault();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className={`${className}`}>
      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="!text-2xl font-bold h-10 mt-1"
            aria-label="Edit card title"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="fime-outline"
              onClick={handleSave}
              size="sm"
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              Lưu
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Hủy
            </Button>
          </div>
        </div>
      ) : (
        <FimeTitle>
          <h1
            onClick={handleClick}
            className="group text-3xl font-bold cursor-pointer rounded transition-colors"
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleClick();
              }
            }}
            aria-label="Click to edit card title"
          >
            {title}{" "}
            <SquarePen className="edit-logo w-5 h-5 text-fimeYellow ms-1 mb-[3px] hidden group-hover:inline" />
          </h1>
        </FimeTitle>
      )}
    </div>
  );
}
