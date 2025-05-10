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
  GEN_QUERY_KEY,
  genQueryOptions,
  GENS_QUERY_KEY,
} from "@/queries/gen-query";
import {
  UpdateGenBody,
  UpdateGenBodyType,
} from "@/schemaValidations/gen.schema";
import { GenApiRequests } from "@/requests/gen.request";

export default function UpdateGenForm({ genId }: { genId: string }) {
  const router = useRouter();

  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: [GEN_QUERY_KEY, genId] });
  const { data: gen } = useSuspenseQuery(genQueryOptions(genId));

  const form = useForm<UpdateGenBodyType>({
    resolver: zodResolver(UpdateGenBody),
    defaultValues: {
      name: gen.name,
      description: gen.description || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: UpdateGenBodyType) => {
      return await GenApiRequests.update(genId, values);
    },
    onSuccess: () => {
      toast.success("Cập nhật Gen thành công!");
      queryClient.invalidateQueries({ queryKey: [GENS_QUERY_KEY] });
      router.push("/dashboard/gens");
    },
    onError: (error) => {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra!",
        setErrorForm: form.setError,
      });
    },
  });

  async function onSubmit(values: UpdateGenBodyType) {
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
                  Tên Gen <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên Gen" {...field} />
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
