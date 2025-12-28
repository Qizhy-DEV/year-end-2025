import * as React from "react";
import { flexRender, type HeaderGroup, type Header } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/libs/utils";
import SortIcon from "@/components/table/sort-icon";

interface TableHeaderProps<T> {
  headerGroups: HeaderGroup<T>[];
  getSortClickHandler: (_header: Header<T, unknown>) => (() => void) | undefined;
  hasSort?: boolean;
}

export default function TableHeaderComponent<T>(props: Readonly<TableHeaderProps<T>>) {
  const { headerGroups, getSortClickHandler, hasSort = false } = props;

  return (
    <TableHeader>
      {headerGroups.map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header, headerIndex) => {
            const isSortable = hasSort && header.column.getCanSort();
            return (
              <TableHead
                key={header.id}
                style={{ width: header.getSize() }}
                onClick={isSortable ? getSortClickHandler(header) : undefined}
                className={cn(
                  "bg-sidebar! dark:bg-card! text-foreground/80 py-3",
                  isSortable && "cursor-pointer select-none",
                  isSortable && "hover:bg-muted/40 transition",
                  headerIndex === 0 && "pl-4"
                )}
              >
                {header.isPlaceholder ? null : (
                  <React.Fragment>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {isSortable && <SortIcon isSorted={header.column.getIsSorted()} />}
                  </React.Fragment>
                )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
