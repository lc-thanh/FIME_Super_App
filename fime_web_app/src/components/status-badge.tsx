import { Badge } from "@/components/ui/badge";
import { UserStatusType } from "@/schemaValidations/user.schema";
import { Dot } from "lucide-react";

export const StatusBadge = ({
  status,
  className,
}: Readonly<{
  status: UserStatusType;
  className?: string;
}>) => {
  const statusColorMap = {
    ACTIVE:
      "bg-green-50 hover:bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
    INACTIVE:
      "bg-orange-50 hover:bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
    BANNED:
      "bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300",
  };

  const statusNameMap = {
    ACTIVE: "Online",
    INACTIVE: "Offline",
    BANNED: "Banned",
  };

  return (
    <Badge
      className={`rounded-full -py-1 text-xs font-semibold ${statusColorMap[status]} ${className}`}
    >
      <Dot className="-ms-3 -me-1 -my-1 w-8 h-8" />
      <span>{statusNameMap[status]}</span>
    </Badge>
  );
};
