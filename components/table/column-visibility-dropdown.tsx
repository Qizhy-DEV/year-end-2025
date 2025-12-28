import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColumnVisibilityDropdownProps {
  columns: Array<{
    id: string;
    getIsVisible: () => boolean;
    toggleVisibility: (_val: boolean) => void;
    getCanHide: () => boolean;
  }>;
}

export default function ColumnVisibilityDropdown(props: Readonly<ColumnVisibilityDropdownProps>) {
  const { columns } = props;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        {columns
          .filter((col) => col.getCanHide())
          .map((col) => (
            <DropdownMenuCheckboxItem
              key={col.id}
              className="capitalize"
              checked={col.getIsVisible()}
              onCheckedChange={(val: boolean) => col.toggleVisibility(!!val)}
            >
              {col.id.replace(/^__select__$/, "select")}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
