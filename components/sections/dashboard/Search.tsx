import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/context/search-provider";

export function Search({
  className = "",
  placeholder = "Search",
  ...props
}: React.ComponentProps<"button"> & { placeholder?: string }) {
  const { setOpen } = useSearch();
  return (
    <Button
      {...props}
      variant="outline"
      className={cn(
        "group relative h-8 flex-1 justify-start rounded-md bg-muted/25 text-sm font-normal text-muted-foreground shadow-none w-40 pe-12 md:flex-none md:w-64 xl:w-72 cursor-pointer",
        className,
      )}
      aria-keyshortcuts="Meta+K Control+K"
      onClick={() => setOpen(true)}
    >
      <SearchIcon
        aria-hidden="true"
        className="absolute inset-s-1.5 top-1/2 -translate-y-1/2"
        size={16}
      />
      <span className="ms-4 truncate pr-4">{placeholder}</span>
      <kbd className="pointer-events-none absolute inset-e-[0.3rem] top-[0.3rem] hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
        <span className="text-xs">ctrl</span>K
      </kbd>
    </Button>
  );
}
