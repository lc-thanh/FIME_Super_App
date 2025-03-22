import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FimeTitleProps {
  children: ReactNode;
  className?: string;
}

export function FimeTitle({ children, className }: FimeTitleProps) {
  return (
    <div
      className={cn(
        "w-fit bg-clip-text text-transparent bg-gradient-to-br from-30% from-fimeOrange to-fimeYellow to-80%",
        className
      )}
    >
      {children}
    </div>
  );
}
