import { Input } from "@/components/ui/input-with-icon";
import useDebounce from "@/hooks/use-debounce";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TableSearch({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [term, setTerm] = useState<string>(
    searchParams.get("search")?.toString() ?? ""
  );
  const debouncedQuery = useDebounce(term, 500);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    const params = new URLSearchParams(searchParams);

    if (debouncedQuery) {
      params.set("search", debouncedQuery);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const handleClearSearch = () => {
    setTerm("");
  };

  return (
    <Input
      placeholder={placeholder}
      className="h-8 md:w-[20vw] w-[40vw]"
      startIcon={Search}
      endIcon={term ? X : undefined}
      value={term}
      onChange={(e) => {
        setTerm(e.target.value);
      }}
      onEndIconClick={handleClearSearch}
    />
  );
}
