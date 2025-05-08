"use client";

import { Loader2 } from "lucide-react";

export default function TaskDetailsLoader() {
  return (
    <div className="m-auto flex flex-row gap-2 items-center justify-center h-full">
      <Loader2 className="animate-spin" />
      <span>Đang tải..</span>
    </div>
  );
}
