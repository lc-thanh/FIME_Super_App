"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import envConfig from "@/config";
import { handleApiError } from "@/lib/utils";
import { UserApiRequests } from "@/requests/user.request";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function ResetPasswordDialog({
  id,
  fullname,
  open,
  setOpen,
}: {
  id: string;
  fullname: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const mutation = useMutation({
    mutationFn: async (userId: string) => {
      await UserApiRequests.resetPassword(userId);
    },
    onSuccess: () => {
      toast.success(`Đặt lại mật khẩu cho ${fullname} thành công!`);
      setOpen(false);
    },
    onError: (error) => {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra!",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đặt lại mật khẩu cho {fullname}?</DialogTitle>
          <DialogDescription>
            Mật khẩu sẽ đặt về mặc định là{" "}
            <span className="font-bold text-indigo-500 hover:underline">
              {envConfig.NEXT_PUBLIC_USER_DEFAULT_PASSWORD}
            </span>
            , bạn có chắc chắn?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Hủy</Button>
          </DialogClose>
          <Button
            onClick={() => {
              mutation.mutate(id);
            }}
            className="bg-indigo-500 text-indigo-50 hover:bg-indigo-600"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="animate-spin" />}
            Đặt lại
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
