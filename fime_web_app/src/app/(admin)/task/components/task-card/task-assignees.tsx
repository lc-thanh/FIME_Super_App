"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import envConfig from "@/config";
import { cn } from "@/lib/utils";

export interface Assignee {
  id: string;
  fullname: string;
  image?: string;
  teamName?: string;
}

interface TaskAssigneesProps {
  assignees: Assignee[];
  maxVisible?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TaskAssignees({
  assignees,
  maxVisible = 3,
  size = "md",
  className,
}: TaskAssigneesProps) {
  const visibleAssignees = assignees.slice(0, maxVisible);
  const remainingCount = assignees.length - maxVisible;

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  };

  const avatarSize = sizeClasses[size];

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex -space-x-2">
        <TooltipProvider delayDuration={300}>
          {visibleAssignees.map((assignee) => (
            <Tooltip key={assignee.id}>
              <TooltipTrigger asChild>
                <Avatar
                  className={cn(
                    avatarSize,
                    "border-2 border-background ring-0 transition-transform hover:translate-y-[-2px]",
                    "hover:z-10"
                  )}
                >
                  <AvatarImage
                    src={
                      `${envConfig.NEXT_PUBLIC_STATIC_ENDPOINT}/${assignee.image}` ||
                      ""
                    }
                    alt={`${assignee.fullname}'s avatar`}
                  />
                  <AvatarFallback className="text-xs font-medium bg-fimeOrangeLighter text-white">
                    {getInitials(assignee.fullname)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{assignee.fullname}</p>
                {assignee.teamName && (
                  <p className="text-xs text-muted-foreground">
                    {assignee.teamName}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          ))}

          {remainingCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    avatarSize,
                    "flex items-center justify-center rounded-full bg-muted text-muted-foreground",
                    "border-2 border-background font-medium hover:bg-muted/80 transition-transform hover:translate-y-[-2px]"
                  )}
                >
                  +{remainingCount}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>
                  {remainingCount} more{" "}
                  {remainingCount === 1 ? "assignee" : "assignees"}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
