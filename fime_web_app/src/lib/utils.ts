/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function phoneFormatTest(phone: string) {
  const phonePattern: RegExp = /^(03|05|07|08|09|01[2|6|8|9])([0-9]{8})$/;
  return phonePattern.test(phone);
}

export const handleApiError = ({
  error,
  toastMessage = "Có lỗi không xác định",
  setErrorForm,
  duration,
}: {
  error: any;
  toastMessage?: string;
  setErrorForm?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setErrorForm) {
    error.payload.message.map((item) => {
      setErrorForm(item.field, {
        type: "server",
        message: item.error,
      });
    });
  } else if (error.status === 423) {
    toast.error(error.payload.message, {
      duration: duration ?? 5000,
    });
  } else {
    toast.error(toastMessage, {
      duration: duration ?? 5000,
    });
  }
};
