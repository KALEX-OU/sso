"use client";

import React from "react";
import { Calendar as HeroCalendar } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type CalendarProps = React.ComponentProps<typeof HeroCalendar> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const CalendarBase: React.FC<CalendarProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-calendar-skeleton ${className}`} />;
    }

    const content = (
      <HeroCalendar
        className={`klx-calendar ${className}`}
        {...props}
      >
        {children}
      </HeroCalendar>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

CalendarBase.displayName = "Calendar";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const CalendarRoot = HeroCalendar.Root;
export const CalendarHeader = HeroCalendar.Header;
export const CalendarHeading = HeroCalendar.Heading;
export const CalendarNavButton = HeroCalendar.NavButton;
export const CalendarGrid = HeroCalendar.Grid;
export const CalendarGridHeader = HeroCalendar.GridHeader;
export const CalendarGridBody = HeroCalendar.GridBody;
export const CalendarHeaderCell = HeroCalendar.HeaderCell;
export const CalendarCell = HeroCalendar.Cell;
export const CalendarCellIndicator = HeroCalendar.CellIndicator;
export const CalendarYearPickerTrigger = HeroCalendar.YearPickerTrigger;
export const CalendarYearPickerTriggerHeading = HeroCalendar.YearPickerTriggerHeading;
export const CalendarYearPickerTriggerIndicator = HeroCalendar.YearPickerTriggerIndicator;
export const CalendarYearPickerGrid = HeroCalendar.YearPickerGrid;
export const CalendarYearPickerGridBody = HeroCalendar.YearPickerGridBody;
export const CalendarYearPickerCell = HeroCalendar.YearPickerCell;

export const Calendar = Object.assign(CalendarBase, {
  Root: HeroCalendar.Root,
  Header: HeroCalendar.Header,
  Heading: HeroCalendar.Heading,
  NavButton: HeroCalendar.NavButton,
  Grid: HeroCalendar.Grid,
  GridHeader: HeroCalendar.GridHeader,
  GridBody: HeroCalendar.GridBody,
  HeaderCell: HeroCalendar.HeaderCell,
  Cell: HeroCalendar.Cell,
  CellIndicator: HeroCalendar.CellIndicator,
  YearPickerTrigger: HeroCalendar.YearPickerTrigger,
  YearPickerTriggerHeading: HeroCalendar.YearPickerTriggerHeading,
  YearPickerTriggerIndicator: HeroCalendar.YearPickerTriggerIndicator,
  YearPickerGrid: HeroCalendar.YearPickerGrid,
  YearPickerGridBody: HeroCalendar.YearPickerGridBody,
  YearPickerCell: HeroCalendar.YearPickerCell,
});
