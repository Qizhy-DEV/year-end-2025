import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface SortIconProps {
  isSorted?: false | "asc" | "desc";
  className?: string;
}

export default function SortIcon(props: Readonly<SortIconProps>) {
  const { isSorted, className } = props;
  const cls = className ?? "ml-1 inline-block size-4";
  if (isSorted === "asc") return <ArrowUp className={cls} />;
  if (isSorted === "desc") return <ArrowDown className={cls} />;
  return <ArrowUpDown className={cls} />;
}
