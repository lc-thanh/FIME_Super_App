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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TEAMS_QUERY_KEY } from "@/queries/team-query";
import { toast } from "sonner";
import {
  CreateTeamBody,
  CreateTeamBodyType,
} from "@/schemaValidations/team.schema";
import { TeamApiRequests } from "@/requests/team.request";
import { Textarea } from "@/components/ui/textarea";

export default function CreateTeamForm() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const form = useForm<CreateTeamBodyType>({
    resolver: zodResolver(CreateTeamBody),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: CreateTeamBodyType) => {
      return await TeamApiRequests.create(values);
    },
    onSuccess: () => {
      toast.success("Tạo Ban mới thành công!");
      queryClient.invalidateQueries({ queryKey: [TEAMS_QUERY_KEY] });
      router.push("/dashboard/teams");
    },
    onError: (error) => {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra!",
        setErrorForm: form.setError,
      });
    },
  });

  async function onSubmit(values: CreateTeamBodyType) {
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
                  Tên ban <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên ban" {...field} />
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
