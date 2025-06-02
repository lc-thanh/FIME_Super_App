/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { EyeOffIcon, EyeIcon } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Input } from "@/components/ui/input";
import { createElement, useState } from "react";
import { cn } from "@/lib/utils";

type PasswordInputProps = {
  field: any;
  placeholder?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function PasswordInput({
  field,
  placeholder = "Enter password",
  className,
  onChange, // nhận prop onChange
}: PasswordInputProps) {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  return (
    <Box className="relative">
      <Input
        {...field}
        type={passwordVisibility ? "text" : "password"}
        autoComplete="on"
        placeholder={placeholder}
        className={cn("pr-12", className)}
        onChange={onChange ?? field.onChange} // ưu tiên onChange truyền vào, fallback về field.onChange
      />
      <Box
        className="absolute inset-y-0 right-0 flex cursor-pointer items-center p-3 text-muted-foreground"
        onClick={() => setPasswordVisibility(!passwordVisibility)}
      >
        {createElement(passwordVisibility ? EyeOffIcon : EyeIcon, {
          className: "h-5 w-5",
        })}
      </Box>
    </Box>
  );
}
