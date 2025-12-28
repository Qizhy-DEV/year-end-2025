import * as React from "react";
import type { CellContext } from "@tanstack/react-table";
import { Typography } from "@/components/ui/typography";
import { formatDate } from "@/lib/format-date";

type DateCellProps<TData, TValue = string | Date> = {
  cell: CellContext<TData, TValue>;
  variant?: React.ComponentProps<typeof Typography>["variant"];
  className?: string;
};

export function DateCellRenderer<TData, TValue = string | Date>({
  cell,
  variant = "span",
  className,
}: DateCellProps<TData, TValue>) {
  const value = cell.getValue();
  if (!value) {
    return (
      <Typography variant={variant} className={className + " text-muted-foreground italic"}>
        N/A
      </Typography>
    );
  }

  if (value instanceof Date || typeof value === "string") {
    return (
      <Typography variant={variant} className={className}>
        {formatDate(value, "DD-MM-YYYY")}
      </Typography>
    );
  }

  return (
    <Typography variant={variant} className={className + " text-muted-foreground italic"}>
      N/A
    </Typography>
  );
}

// TanStack Table cell renderer
export const DateCell = <TData, TValue = string | Date>({ cell }: CellContext<TData, TValue>) => {
  const value = cell.getValue();
  if (!value) {
    return (
      <Typography variant="span" className="text-muted-foreground italic">
        N/A
      </Typography>
    );
  }

  if (value instanceof Date || typeof value === "string") {
    return <Typography variant="span">{formatDate(value, "DD-MM-YYYY")}</Typography>;
  }

  return (
    <Typography variant="span" className="text-muted-foreground italic">
      N/A
    </Typography>
  );
};
