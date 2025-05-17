"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Paperclip, Plus, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTaskAttachmentBody,
  CreateTaskAttachmentBodyType,
} from "@/schemaValidations/task.schema";
import { TaskApiRequests } from "@/requests/task.request";
import {
  TASK_ACTIVITIES_QUERY_KEY,
  TASK_ATTACHMENTS_QUERY_KEY,
} from "@/queries/task-query";

interface AddTaskAttachmentFormProps {
  taskId: string;
}

export function TaskAttachmentForm({ taskId }: AddTaskAttachmentFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CreateTaskAttachmentBodyType>({
    resolver: zodResolver(CreateTaskAttachmentBody),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: CreateTaskAttachmentBodyType) => {
      return await TaskApiRequests.addTaskAttachment(taskId, values);
    },
    onSuccess: () => {
      toast.success("Đã thêm đính kèm mới!");
      queryClient.invalidateQueries({
        queryKey: [TASK_ATTACHMENTS_QUERY_KEY, taskId],
      });
      queryClient.invalidateQueries({
        queryKey: [TASK_ACTIVITIES_QUERY_KEY],
      });
      form.reset();
      setIsAdding(false);
    },
    onError: (error) => {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra khi thêm đính kèm!",
        setErrorForm: form.setError,
      });
    },
  });

  const onSubmit = (values: CreateTaskAttachmentBodyType) => {
    mutation.mutate(values);
  };

  if (!isAdding) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={() => setIsAdding(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Thêm đính kèm
      </Button>
    );
  }

  return (
    <div className="border rounded-md p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium flex items-center">
          <Paperclip className="h-4 w-4 mr-2" />
          Thêm đính kèm mới
        </h4>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsAdding(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Đóng</span>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tiêu đề <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tiêu đề đính kèm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Đường dẫn <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://drive.google.com/drive/..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              variant="animated-gradient"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Đang thêm..." : "Thêm đính kèm"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
