"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function NewTaskDialog() {
  return (
    <Button variant="gradient">
      <Plus className="mr-2 h-4 w-4" /> Thêm Task Mới
    </Button>
  );
}
