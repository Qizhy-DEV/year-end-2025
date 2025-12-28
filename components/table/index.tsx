import * as React from "react";
import { useMemo, useEffect } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type Table as ReactTable,
  type Row,
} from "@tanstack/react-table";

import { cn } from "@/libs/utils";

import { Table } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import TableHeaderComponent from "@/components/table/table-header";
import TableBodyComponent from "@/components/table/table-body";

// Simplified version without pagination and routing for Next.js
interface Props<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  hasSelector?: boolean;
  className?: string;
  onRowClick?: (_data: T) => void;
  onItemSelect?: (_items: T[]) => void;
  hasSort?: boolean;
}

/**
 * Simplified DataTable for Next.js without routing
 */
export default function DataTable<T extends object>({
  data,
  columns,
  isLoading = false,
  hasSelector = false,
  className,
  onRowClick,
  onItemSelect,
  hasSort = false,
}: Readonly<Props<T>>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

  // Compose columns with optional selection checkbox
  const composedColumns = useMemo<ColumnDef<T>[]>(() => {
    if (!hasSelector) return columns;
    const selectCol: ColumnDef<T> = {
      id: "__select__",
      header: ({ table }: { table: ReactTable<T> }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          onCheckedChange={(val: boolean) => table.toggleAllPageRowsSelected(!!val)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: { row: Row<T> }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          onCheckedChange={(val: boolean) => row.toggleSelected(!!val)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 36,
      maxSize: 36,
    } as ColumnDef<T>;
    return [selectCol, ...columns];
  }, [columns, hasSelector]);

  // Simple sort handler without URL
  function getSortClickHandler(header: any) {
    if (!hasSort) return undefined;
    if (header?.column?.getCanSort?.()) {
      return () => {
        const colId = header.column.id;
        const currentSorted = sorting.find((s) => s.id === colId);
        let nextSort: SortingState = [];
        if (!currentSorted) {
          nextSort = [{ id: colId, desc: false }];
        } else if (!currentSorted.desc) {
          nextSort = [{ id: colId, desc: true }];
        } else {
          nextSort = [];
        }
        setSorting(nextSort);
      };
    }
    return undefined;
  }

  // useReactTable setup
  const table = useReactTable({
    data: data || [],
    columns: composedColumns,
    state: {
      sorting: hasSort ? sorting : [],
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: hasSelector,
    onSortingChange: hasSort ? setSorting : undefined,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Notify selected items
  useEffect(() => {
    if (!hasSelector || !onItemSelect) return;
    const selected = table.getSelectedRowModel().rows.map((r) => r.original as T);
    onItemSelect(selected);
  }, [hasSelector, onItemSelect, table, rowSelection]);

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <div className="border-border overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeaderComponent
              headerGroups={table.getHeaderGroups()}
              getSortClickHandler={getSortClickHandler}
              hasSort={hasSort}
            />
            <TableBodyComponent
              isLoading={isLoading}
              rows={table.getRowModel().rows}
              onRowClick={onRowClick}
              getAllLeafColumns={() => table.getAllLeafColumns()}
            />
          </Table>
        </div>
      </div>
    </div>
  );
}

export type { ColumnDef };
