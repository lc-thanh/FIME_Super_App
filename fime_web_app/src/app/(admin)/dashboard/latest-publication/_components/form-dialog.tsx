"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { handleApiError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type CreatePublicationBodyType,
  CreatePublicationBody,
  type UpdatePublicationBodyType,
  UpdatePublicationBody,
  LatestPublicationType,
} from "@/schemaValidations/publication.schema";
import { PublicationApiRequests } from "@/requests/publication.request";
import { PUBLICATIONS_QUERY_KEY } from "@/queries/publication-query";
import { useEffect } from "react";

interface PublicationFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  publication?: Omit<LatestPublicationType, "createdAt" | "updatedAt">;
  mode: "create" | "edit";
}

export default function PublicationFormDialog({
  isOpen,
  onClose,
  publication,
  mode,
}: PublicationFormDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<CreatePublicationBodyType | UpdatePublicationBodyType>({
    resolver: zodResolver(
      mode === "create" ? CreatePublicationBody : UpdatePublicationBody
    ),
    defaultValues: {
      title: publication?.title || "",
      note: publication?.note || "",
      embed_code: publication?.embed_code || "",
    },
  });

  // Reset form when publication changes or dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: publication?.title || "",
        note: publication?.note || "",
        embed_code: publication?.embed_code || "",
      });
    }
  }, [form, isOpen, publication]);

  const createMutation = useMutation({
    mutationFn: async (values: CreatePublicationBodyType) => {
      return await PublicationApiRequests.create(values);
    },
    onSuccess: () => {
      toast.success("Tạo mới Publication thành công!");
      queryClient.invalidateQueries({ queryKey: [PUBLICATIONS_QUERY_KEY] });
      onClose();
    },
    onError: (error) => {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra!",
        setErrorForm: form.setError,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: UpdatePublicationBodyType) => {
      if (!publication) {
        toast.error("Có lỗi xảy ra!");
        return;
      }
      return await PublicationApiRequests.update(publication.id, values);
    },
    onSuccess: () => {
      toast.success("Cập nhật ấn phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: [PUBLICATIONS_QUERY_KEY] });
      onClose();
    },
    onError: (error) => {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra!",
        setErrorForm: form.setError,
      });
    },
  });

  const mutation = mode === "create" ? createMutation : updateMutation;

  async function onSubmit(
    values: CreatePublicationBodyType | UpdatePublicationBodyType
  ) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Thêm Ấn Phẩm Mới Nhất" : "Chỉnh sửa Ấn Phẩm"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log(errors);
            })}
            className="space-y-3 w-full"
          >
            <div className="space-y-3 w-full">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tiêu đề <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập ghi chú" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="embed_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Embed Code <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập embed code"
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="!mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-[100px]"
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button
                variant="gradient"
                type="submit"
                className="w-[100px]"
                disabled={mutation.isPending}
              >
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {mode === "create" ? "Tạo mới" : "Xác nhận"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
