"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { cn } from "@/lib/utils";

interface AnimatedNumberCardProps {
  label: string;
  number: number;
  textColor?: string;
  duration?: number;
}

export function AnimatedNumberCard({
  label,
  number,
  textColor = "text-primary",
  duration = 1000,
}: AnimatedNumberCardProps) {
  const animatedNumber = useAnimatedNumber(number, duration);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "text-3xl font-bold",
            textColor,
            "transition-colors duration-500 ease-in-out"
          )}
        >
          {animatedNumber.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
