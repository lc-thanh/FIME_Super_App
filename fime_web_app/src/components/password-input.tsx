"use client";

import { EyeOffIcon, EyeIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Box } from "@/components/ui/box";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createElement, JSX, useState } from "react";
import { cn } from "@/lib/utils";

type PasswordFieldProps = {
  name?: string;
  label?: string | JSX.Element;
  placeholder?: string;
  description?: string | JSX.Element;
};

export function PasswordField({
  name = "password",
  label = "Password",
  placeholder = "Enter password",
  description,
}: PasswordFieldProps) {
  const {
    control,
    // getFieldState
  } = useFormContext();
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Box className="relative">
              <Input
                {...field}
                type={passwordVisibility ? "text" : "password"}
                autoComplete="on"
                placeholder={placeholder}
                className={cn(
                  "pr-12"
                  // `${getFieldState(name).error && "text-destructive"}`
                )}
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
          </FormControl>
          <FormMessage />
          {description}
        </FormItem>
      )}
    />
  );
}
