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
import { Calendar, ImageUp, Loader2, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { getImageUrl, handleApiError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type CreateNewestProductBodyType,
  CreateNewestProductBody,
  type UpdateNewestProductBodyType,
  UpdateNewestProductBody,
  type NewestProductType,
} from "@/schemaValidations/newest-product.schema";
import { NewestProductApiRequests } from "@/requests/newest-product.request";
import { NEWEST_PRODUCTS_QUERY_KEY } from "@/queries/newest-product-query";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import Image from "next/image";

interface NewestProductFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Omit<NewestProductType, "createdAt" | "updatedAt">;
  mode: "create" | "edit";
}

export default function NewestProductFormDialog({
  isOpen,
  onClose,
  product,
  mode,
}: NewestProductFormDialogProps) {
  const queryClient = useQueryClient();
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);

  const form = useForm<
    CreateNewestProductBodyType | UpdateNewestProductBodyType
  >({
    resolver: zodResolver(
      mode === "create" ? CreateNewestProductBody : UpdateNewestProductBody
    ),
    defaultValues: {
      title: product?.title || "",
      note: product?.note || "",
      image: undefined,
      link: product?.link || "",
      date: product?.date ? new Date(product.date) : new Date(),
    },
  });

  // Reset form when production changes or dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setImageUpload(null);
      setIsImageChanged(false);
      form.reset({
        title: product?.title || "",
        note: product?.note || "",
        image: undefined,
        link: product?.link || "",
        date: product?.date ? new Date(product.date) : new Date(),
      });
    }
  }, [form, isOpen, product]);

  const createMutation = useMutation({
    mutationFn: async (values: CreateNewestProductBodyType) => {
      return await NewestProductApiRequests.create(values);
    },
    onSuccess: () => {
      toast.success("Tạo mới sản phẩm thành công!");
      queryClient.invalidateQueries({
        queryKey: [NEWEST_PRODUCTS_QUERY_KEY],
      });
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
    mutationFn: async (values: UpdateNewestProductBodyType) => {
      if (!product) {
        toast.error("Có lỗi xảy ra!");
        return;
      }
      return await NewestProductApiRequests.update(product.id, {
        ...values,
        isImageChanged,
      });
    },
    onSuccess: () => {
      toast.success("Cập nhật sản phẩm thành công!");
      queryClient.invalidateQueries({
        queryKey: [NEWEST_PRODUCTS_QUERY_KEY],
      });
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
    values: CreateNewestProductBodyType | UpdateNewestProductBodyType
  ) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Thêm Sản Phẩm Mới" : "Chỉnh sửa Sản Phẩm"}
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
              <div className="space-y-3 flex flex-col items-center">
                <FormLabel>Hình ảnh</FormLabel>
                <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-md">
                  <Image
                    src={
                      isImageChanged
                        ? imageUpload
                          ? URL.createObjectURL(imageUpload)
                          : "/login_page_cover.jpg"
                        : getImageUrl(product?.image as string) ||
                          "/login_page_cover.jpg"
                    }
                    alt="Hình ảnh xem trước"
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex flex-row space-x-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setImageUpload(null);
                      form.setValue("image", undefined);
                      setIsImageChanged(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa ảnh
                  </Button>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { onChange } }) => (
                      <FormItem className="w-fit">
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = (event) => {
                                const file = (event.target as HTMLInputElement)
                                  .files?.[0];
                                if (file) {
                                  onChange(file);
                                  setImageUpload(file);
                                  setIsImageChanged(true);
                                }
                              };
                              input.click();
                            }}
                          >
                            <ImageUp className="h-4 w-4 mr-2" />
                            Chọn ảnh
                          </Button>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Ngày <span className="text-destructive">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: vi })
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liên kết</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập liên kết" {...field} />
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
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả"
                        className="w-full h-36 resize-y"
                        {...field}
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
