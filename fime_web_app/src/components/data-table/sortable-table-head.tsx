"use client";

import { TableHead } from "@/components/ui/table";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Nếu hiện tại đang order bằng cột khác thì sẽ order theo cột này với chiều giảm dần
// Còn nếu đang order theo cột này với chiều giảm dần thì đổi chiều
// Còn nếu đang order theo cột này với chiều tăng dần thì xóa sortOrder
const orderInNextClick = ({
  sortBy,
  orderName,
  sortOrder,
}: {
  sortBy: string | undefined;
  orderName: string;
  sortOrder: string | undefined;
}) => {
  if (sortBy !== orderName) {
    return {
      sortBy: orderName,
      sortOrder: "desc",
    };
  } else if (sortOrder === "desc") {
    return {
      sortBy: orderName,
      sortOrder: "asc",
    };
  } else {
    return {
      sortBy: null,
      sortOrder: null,
    };
  }
};

export default function SortableTableHead({
  children,
  className,
  orderName,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  orderName: string;
}>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const sortBy = searchParams.get("sortBy")?.toString();
  const sortOrder = searchParams.get("sortOrder")?.toString();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    const nextClick = orderInNextClick({
      sortBy,
      orderName,
      sortOrder,
    });
    if (!nextClick.sortBy) {
      params.delete("sortBy");
      params.delete("sortOrder");
    } else {
      params.set("sortBy", nextClick.sortBy);
      params.set("sortOrder", nextClick.sortOrder);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <TableHead className={className}>
      <a
        className="flex flex-row cursor-pointer items-center h-full justify-around"
        onClick={handleClick}
      >
        {children}
        {sortBy === orderName ? (
          sortOrder === "asc" ? (
            <ChevronUp size={18} className="text-blue-500" />
          ) : (
            <ChevronDown size={18} className="text-blue-500" />
          )
        ) : (
          <ChevronsUpDown size={18} />
        )}
      </a>
    </TableHead>
  );
}
