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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getImageUrl, handleApiError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  UpdateUserBody,
  UpdateUserBodyType,
  UserRole,
} from "@/schemaValidations/user.schema";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { positionSelectors } from "@/queries/position-query";
import { RoleSelector } from "@/components/role-selector";
import { teamSelectorsQueryOptions } from "@/queries/team-query";
import { UserApiRequests } from "@/requests/user.request";
import { toast } from "sonner";
import {
  USER_QUERY_KEY,
  userQueryOptions,
  USERS_QUERY_KEY,
} from "@/queries/user-query";
import { genSelectorsQueryOptions } from "@/queries/gen-query";

export default function UpdateUserForm({ userId }: { userId: string }) {
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY, userId] });
  const { data: user } = useSuspenseQuery(userQueryOptions(userId));
  const { data: positions } = useSuspenseQuery(positionSelectors());
  const { data: teams } = useSuspenseQuery(teamSelectorsQueryOptions());
  const { data: gens } = useSuspenseQuery(genSelectorsQueryOptions());

  const form = useForm<UpdateUserBodyType>({
    resolver: zodResolver(UpdateUserBody),
    defaultValues: {
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      address: user.address || "",
      positionId: user.positionId || undefined,
      teamId: user.teamId || undefined,
      genId: user.genId || undefined,
      role: user.role,
    },
  });

  const mutation = useMutation({
    mutationFn: async (
      values: UpdateUserBodyType & { isImageChanged: boolean }
    ) => {
      return await UserApiRequests.update(userId, values);
    },
    onSuccess: () => {
      toast.success("Cập nhật thành viên thành công!");
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      router.push("/dashboard/users");
    },
    onError: (error) => {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra!",
        setErrorForm: form.setError,
      });
    },
  });

  async function onSubmit(values: UpdateUserBodyType) {
    mutation.mutate({
      ...values,
      isImageChanged,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log(errors);
        })}
        className="space-y-3 w-full lg:grid grid-cols-2 gap-6"
      >
        <div className="space-y-3">
          <div className="space-y-3 flex flex-col items-center">
            <FormLabel>Ảnh đại diện</FormLabel>
            <Image
              src={
                isImageChanged
                  ? imageUpload
                    ? URL.createObjectURL(imageUpload)
                    : "/user/null.png"
                  : getImageUrl(user.image) || "/user/null.png"
              }
              width={150}
              height={0}
              alt="Ảnh đại diện xem trước"
            />

            <div className="flex flex-row space-x-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setImageUpload(null);
                  form.setValue("image", undefined);
                  setIsImageChanged(true);
                }}
              >
                <Trash2 />
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
                        variant="fime-outline"
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
                        <ImageUp />
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
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Họ và tên <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nhập họ và tên" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <div>
                    <Input
                      placeholder="email@example.com"
                      type="email"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Số điện thoại <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="0987654321" type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập địa chỉ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3 flex flex-col justify-between">
          <FormField
            control={form.control}
            name="positionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chức vụ</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chức vụ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="teamId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ban</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ban" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gen</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn Gen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gens.map((gen) => (
                      <SelectItem key={gen.id} value={gen.id}>
                        {gen.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vai trò</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={UserRole.Values.MEMBER}
                >
                  <FormControl>
                    <RoleSelector
                      onChange={field.onChange}
                      defaultValue={field.value}
                    />
                  </FormControl>
                </Select>
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
