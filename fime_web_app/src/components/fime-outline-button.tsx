"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FimeTitle } from "@/components/fime-title";
import { LucideIcon } from "lucide-react";

// First, let's add a keyframes animation for the gradient flow
// Add this at the top of the file, after the imports:

const gradientAnimation = `
  @keyframes gradientFlow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

export type GradientOutlineButtonProps = ButtonProps & {
  icon?: LucideIcon;
};

// Now, update the Button component to include the animation and style tag
// Replace the existing GradientOutlineButton component with this:

export const FimeOutlineButton = React.forwardRef<
  HTMLButtonElement,
  GradientOutlineButtonProps
>(({ className, children, icon, ...props }, ref) => {
  return (
    <>
      <style jsx global>
        {gradientAnimation}
      </style>
      <Button
        ref={ref}
        className={cn(
          "relative border-0 bg-transparent hover:bg-transparent transition-all duration-300",
          "before:absolute before:inset-0 before:rounded-md before:p-[3px] before:bg-gradient-to-br before:from-fimeOrange before:from-20% before:to-fimeYellowLighter before:to-50% before:content-['']",
          "before:bg-[length:200%_200%] before:transition-all before:duration-300",
          "hover:before:animate-[gradientFlow_3s_ease_infinite] hover:before:shadow-[0_0_8px_rgba(254,77,38,0.5)]",
          "after:absolute after:inset-[1px] after:rounded-[5px] after:bg-background after:content-['']",
          className
        )}
        {...props}
      >
        <div className="relative flex flex-row items-center gap-2 z-10">
          {icon &&
            React.createElement(icon, {
              className: "!text-fimeOrange",
            })}
          <FimeTitle className="text-sm mb-[1px]">{children}</FimeTitle>
        </div>
      </Button>
    </>
  );
});
FimeOutlineButton.displayName = "GradientOutlineButton";
