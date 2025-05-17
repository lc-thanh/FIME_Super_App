"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WorkspaceApiRequest } from "@/requests/workspace.request";
import { MY_WORKSPACES_QUERY_KEY } from "@/queries/workspace-query";
import { HttpError } from "@/lib/http";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PasswordInput } from "@/components/password-input";

interface DeleteWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  workspaceName: string;
}

export function DeleteWorkspaceDialog({
  open,
  onOpenChange,
  workspaceId,
  workspaceName,
}: DeleteWorkspaceDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      password,
    }: {
      workspaceId: string;
      password: string;
    }) => {
      return await WorkspaceApiRequest.deleteWorkspace(workspaceId, password);
    },
    onSuccess: () => {
      toast.success("Workspace đã được xóa thành công");
      queryClient.invalidateQueries({ queryKey: [MY_WORKSPACES_QUERY_KEY] });
      onOpenChange(false);
      setPassword("");
      setError(null);
    },
    onError: (error: HttpError) => {
      if (error?.status === 401) {
        setError("Mật khẩu không chính xác");
      } else {
        setError("Có lỗi xảy ra khi xóa workspace");
        toast.error("Có lỗi xảy ra khi xóa workspace");
      }
    },
  });

  const handleDelete = () => {
    if (!password.trim()) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    deleteMutation.mutate({ workspaceId, password });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">Xóa Workspace</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa workspace &quot;<b>{workspaceName}</b>
            &quot;? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Có lỗi!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Nhập mật khẩu của bạn để xác nhận</Label>
            <PasswordInput
              field={{
                id: "password",
                value: password,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  setError(null);
                },
              }}
              placeholder="Mật khẩu của bạn"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setPassword("");
              setError(null);
            }}
            disabled={deleteMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending || !password.trim()}
          >
            {deleteMutation.isPending ? "Đang xóa..." : "Xóa Workspace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
