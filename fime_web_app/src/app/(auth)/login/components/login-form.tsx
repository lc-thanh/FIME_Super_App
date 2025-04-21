"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FimeTitle } from "@/components/fime-title";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { PasswordField } from "@/components/password-input";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { authenticate } from "@/actions";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has("redirectFrom")) {
      toast.error("Bạn cần đăng nhập để tiếp tục");
    }
  }, [searchParams]);

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginBodyType) {
    setLoading(true);
    const res = await authenticate(values.username, values.password);
    if (res?.error) {
      if (res.code === 1)
        form.setError("username", {
          type: "server",
          message: "Không tồn tại Email hoặc Số điện thoại này!",
        });
      else if (res.code === 2)
        form.setError("password", {
          type: "server",
          message: "Mật khẩu không chính xác!",
        });
      else if (res.code === 3) toast.error("Tài khoản của bạn đã bị khóa!");
      else toast.error("Có lỗi xảy ra phía máy chủ!");
    } else {
      toast.success("Đăng nhập thành công!");
      const callbackUrl = searchParams.get("redirectFrom") || "/dashboard";
      router.push(callbackUrl);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center text-center">
                  <FimeTitle className="text-2xl font-bold">
                    Chào FIME!
                  </FimeTitle>
                  <p className="text-balance text-muted-foreground">
                    Hãy đăng nhập để tiếp tục
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email/Số điện thoại{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="0987654321" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <PasswordField
                  name="password"
                  label={
                    <span>
                      Mật khẩu <span className="text-destructive">*</span>
                    </span>
                  }
                  placeholder="Mật khẩu"
                  description={
                    <FormDescription className="text-right">
                      <Link
                        href="#"
                        className="hover:underline hover:underline-offset-4 hover:text-fimeOrange"
                      >
                        Quên mật khẩu?
                      </Link>
                    </FormDescription>
                  }
                />

                <Button
                  type="submit"
                  className="w-full"
                  variant="animated-gradient"
                  disabled={loading}
                >
                  {loading && <Loader2 className="animate-spin" />}
                  Đăng nhập
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Hoặc tiếp tục với
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Button variant="outline" className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Đăng nhập bằng Google</span>
                  </Button>
                </div>
                {/* <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div> */}
              </div>
            </form>
          </Form>
          <div className="relative hidden bg-muted md:block">
            <Image
              width={1000}
              height={1000}
              src="/login_page_cover.jpg"
              alt="Image"
              priority={true}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.90]"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-fimeOrange">
        Nếu chưa có tài khoản, hãy liên hệ với <a href="#">Ban phụ trách</a> để
        mở tài khoản.
      </div>
    </div>
  );
}
