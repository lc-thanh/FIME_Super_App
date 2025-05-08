"use client";

import { Check, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FacetedFilterOption } from "@/types/data-table";

interface DataTableFacetedFilterProps {
  filterName: string;
  title: string;
  options: FacetedFilterOption[];
}

export function TableFacetedFilter({
  filterName,
  title,
  options,
}: DataTableFacetedFilterProps) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramFilterValues = searchParams.getAll(filterName);
  const selectedValues = new Set(
    Array.isArray(paramFilterValues) ? paramFilterValues : []
  );

  const handleSelect = (isSelected: boolean, value: string) => {
    if (isSelected) {
      selectedValues.delete(value);
    } else {
      selectedValues.add(value);
    }
    const filterValues = Array.from(selectedValues);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.delete(filterName);
    filterValues.forEach((value) => {
      params.append(filterName, value);
    });
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.delete(filterName);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-fit border-dashed">
          <PlusCircle className="mr-2 size-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    Đã chọn {selectedValues.size}
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[12.5rem] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList className="max-h-full">
            <CommandEmpty>Không có kết quả</CommandEmpty>
            <CommandGroup className="max-h-[18.75rem] overflow-y-auto overflow-x-hidden">
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      handleSelect(isSelected, option.value);
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="size-4" aria-hidden="true" />
                    </div>
                    {option.icon && (
                      <option.icon
                        className="mr-2 size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    )}
                    <span className={`text-${option.color}-500`}>
                      {option.label}
                    </span>
                    {(option.count || option.count === 0) && (
                      <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                        {option.count}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => handleClear()}
                    className="justify-center text-center"
                  >
                    Xóa bộ lọc
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
