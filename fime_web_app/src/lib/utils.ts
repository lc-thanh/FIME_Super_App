/* eslint-disable @typescript-eslint/no-explicit-any */
import envConfig from "@/config";
import { clientTokens, EntityError } from "@/lib/http";
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
    if (error.payload.message) {
      toast.error(error.payload.message, {
        duration: duration ?? 5000,
      });
    } else {
      toast.error(toastMessage, {
        duration: duration ?? 5000,
      });
    }
  }
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage < 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }
  if (currentPage === 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage > totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }
  if (currentPage === totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export const zodPreprocess = (value: any) => {
  if (!value || typeof value !== "string") return undefined;
  return value === "" ? undefined : value;
};

export function objectToFormData<T extends Record<string, any>>(
  data: T,
  transformKeys?: (key: string, value: any) => any
): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // Nếu transformKeys có tồn tại, áp dụng transform trước
      const transformedValue = transformKeys
        ? transformKeys(key, value)
        : value;

      // Nếu value là Date, chuyển thành ISO string
      if (transformedValue instanceof Date) {
        formData.append(key, transformedValue.toISOString());
      }
      // Nếu value là string hoặc Blob, append trực tiếp, ngược lại JSON.stringify
      else {
        formData.append(
          key,
          transformedValue instanceof Blob ||
            typeof transformedValue === "string"
            ? transformedValue
            : JSON.stringify(transformedValue)
        );
      }
    }
  });
  return formData;
}

export const getImageUrl = (filename?: string) => {
  if (!filename) return undefined;
  return `${envConfig.NEXT_PUBLIC_STATIC_ENDPOINT}/users/avatars/${filename}`;
};

export const getProductImageUrl = (image?: string) => {
  if (!image) return undefined;
  if (image.startsWith("http")) {
    return image;
  }
  return `${envConfig.NEXT_PUBLIC_STATIC_ENDPOINT}/newest-products/images/${image}`;
};

export const getClientRole = () => {
  if (typeof window !== "undefined") return clientTokens.user?.role;
};
