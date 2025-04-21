"use client";

import { LogoutChild } from "@/app/(auth)/logout/logout-child";
import { Suspense } from "react";

export default function LogoutPage() {
  return (
    <Suspense>
      <LogoutChild />
    </Suspense>
  );
}
