"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Lock } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  ChangePasswordBody,
  ChangePasswordBodyType,
} from "@/schemaValidations/auth.schema";
import { PasswordInput } from "@/components/password-input";
import { useMutation } from "@tanstack/react-query";
import AuthApiRequests from "@/requests/auth.request";
import { handleApiError } from "@/lib/utils";

export default function ChangePasswordDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const mutation = useMutation({
    mutationFn: async (values: ChangePasswordBodyType) => {
      return await AuthApiRequests.changePassword(
        values.oldPassword,
        values.newPassword
      );
    },
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
      setOpen(false);
    },
    onError: (error) => {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra",
        setErrorForm: form.setError,
      });
    },
  });

  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      repeatPassword: "",
    },
  });

  async function onSubmit(values: ChangePasswordBodyType) {
    mutation.mutate({
      ...values,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Đổi mật khẩu
          </DialogTitle>
          <DialogDescription>
            Nhập mật khẩu cũ và mật khẩu mới để thay đổi
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name={"oldPassword"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span>
                      Mật khẩu cũ <span className="text-destructive">*</span>
                    </span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      field={field}
                      placeholder="Nhập mật khẩu cũ"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"newPassword"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span>
                      Mật khẩu mới <span className="text-destructive">*</span>
                    </span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      field={field}
                      placeholder="Nhập mật khẩu mới"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"repeatPassword"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span>
                      Xác nhận mật khẩu mới{" "}
                      <span className="text-destructive">*</span>
                    </span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      field={field}
                      placeholder="Nhập lại khẩu mới"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    form.reset();
                  }}
                  disabled={mutation.isPending}
                >
                  Hủy bỏ
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="animated-gradient"
                className="flex-1"
                disabled={mutation.isPending}
              >
                {mutation.isPending && <Loader2 className="animate-spin" />}
                Đổi mật khẩu
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
