import { flexRender, type Row, type Column } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/libs/utils";
import { Skeleton } from "../ui/skeleton";
import { PackageOpen } from "@/components/icons";

interface TableBodyProps<T> {
  isLoading: boolean;
  rows: Row<T>[];
  onRowClick?: (_data: T) => void;
  getAllLeafColumns: () => Array<Column<T, unknown>>;
}

export default function TableBodyComponent<T>(props: Readonly<TableBodyProps<T>>) {
  const { isLoading, rows, onRowClick, getAllLeafColumns } = props;

  return (
    <TableBody>
      {isLoading ? (
        Array.from({ length: 12 }).map((_, rowIndex) => (
          <TableRow key={rowIndex} className="h-12 border-t-[1px]">
            {getAllLeafColumns().map((_, colIndex) => (
              <TableCell key={colIndex} className={cn("py-2", colIndex === 0 && "pl-4")}>
                <Skeleton className="h-6 w-full rounded-md" />
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : rows?.length ? (
        rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className={cn(onRowClick ? "cursor-pointer" : undefined, "font-normal!")}
            onClick={() => {
              if (onRowClick) onRowClick(row.original);
            }}
          >
            {row.getVisibleCells().map((cell, cellIndex) => (
              <TableCell
                key={cell.id}
                style={{ width: cell.column.getSize(), borderColor: "var(--border)" }}
                className={cn("border-border", cellIndex === 0 && "pl-4")}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={getAllLeafColumns().length}
            className="border-border text-foreground h-24 text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <PackageOpen className="text-foreground/80 size-5" />
              No results.
            </div>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
