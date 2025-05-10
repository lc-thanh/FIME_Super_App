"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { handleApiError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  UpdatePositionBody,
  UpdatePositionBodyType,
} from "@/schemaValidations/position.schema";
import {
  POSITION_QUERY_KEY,
  positionQueryOptions,
  POSITIONS_QUERY_KEY,
} from "@/queries/position-query";
import { PositionApiRequests } from "@/requests/position.request";

export default function UpdatePositionForm({
  positionId,
}: {
  positionId: string;
}) {
  const router = useRouter();

  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: [POSITION_QUERY_KEY, positionId] });
  const { data: position } = useSuspenseQuery(positionQueryOptions(positionId));

  const form = useForm<UpdatePositionBodyType>({
    resolver: zodResolver(UpdatePositionBody),
    defaultValues: {
      name: position.name,
      description: position.description || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: UpdatePositionBodyType) => {
      return await PositionApiRequests.update(positionId, values);
    },
    onSuccess: () => {
      toast.success("Cập nhật chức vụ thành công!");
      queryClient.invalidateQueries({ queryKey: [POSITIONS_QUERY_KEY] });
      router.push("/dashboard/positions");
    },
    onError: (error) => {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra!",
        setErrorForm: form.setError,
      });
    },
  });

  async function onSubmit(values: UpdatePositionBodyType) {
    mutation.mutate({
      ...values,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log(errors);
        })}
        className="space-y-3 sm:w-[50vw] w-full max-w-[600px] gap-6"
      >
        <div className="space-y-3 w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên chức vụ <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên chức vụ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea placeholder="Nhập mô tả" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-2 !mt-6 flex flex-row space-x-2 justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-[100px]"
            onClick={() => {
              router.back();
            }}
          >
            Hủy
          </Button>
          <Button
            variant="animated-gradient"
            type="submit"
            className="w-[100px]"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="animate-spin" />}
            Xác nhận
          </Button>
        </div>
      </form>
    </Form>
  );
}
