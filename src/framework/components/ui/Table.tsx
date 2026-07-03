"use client";

import React from "react";
import {
  Table as HeroTable,
  TableBody as HeroTableBody,
  TableCell as HeroTableCell,
  TableColumn as HeroTableColumn,
  TableContent as HeroTableContent,
  TableHeader as HeroTableHeader,
  TableRow as HeroTableRow,
  TableScrollContainer as HeroTableScrollContainer,
  TableFooter as HeroTableFooter
} from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type TableProps = React.ComponentProps<typeof HeroTable> & {
  isSkeleton?: boolean;
  tooltip?: string;
};

const TableComponent: React.FC<TableProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-table-skeleton ${className}`} />;
    }

    const content = (
      <HeroTable
        className={`klx-table ${className}`}
        {...props}
      >
        {children}
      </HeroTable>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>;
    }

    return content;
  }
);

TableComponent.displayName = "Table";

// Supporto per la sintassi a punti (Compound Components) — pattern unico del framework: Object.assign
export const Table = Object.assign(TableComponent, {
  Body: HeroTableBody,
  Cell: HeroTableCell,
  Column: HeroTableColumn,
  Content: HeroTableContent,
  Header: HeroTableHeader,
  Row: HeroTableRow,
  ScrollContainer: HeroTableScrollContainer,
  Footer: HeroTableFooter
});

export const TableBody = HeroTableBody;
export const TableCell = HeroTableCell;
export const TableColumn = HeroTableColumn;
export const TableContent = HeroTableContent;
export const TableHeader = HeroTableHeader;
export const TableRow = HeroTableRow;
export const TableScrollContainer = HeroTableScrollContainer;
export const TableFooter = HeroTableFooter;
