"use client";

import React from "react";
import { RangeCalendar as HeroRangeCalendar } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type RangeCalendarProps = React.ComponentProps<typeof HeroRangeCalendar> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const RangeCalendarBase: React.FC<RangeCalendarProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-range-calendar-skeleton ${className}`} />;
    }

    const content = (
      <HeroRangeCalendar
        className={`klx-range-calendar ${className}`}
        {...props}
      >
        {children}
      </HeroRangeCalendar>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

RangeCalendarBase.displayName = "RangeCalendar";

// Sub-componenti slot di HeroUI ri-esportati: il root è a COMPOSIZIONE e senza
// gli slot non dipinge contenuto. Pattern compound unico del framework:
// Object.assign sul componente base + re-export nominali paralleli.
export const RangeCalendarRoot = HeroRangeCalendar.Root;
export const RangeCalendarHeader = HeroRangeCalendar.Header;
export const RangeCalendarHeading = HeroRangeCalendar.Heading;
export const RangeCalendarNavButton = HeroRangeCalendar.NavButton;
export const RangeCalendarGrid = HeroRangeCalendar.Grid;
export const RangeCalendarGridHeader = HeroRangeCalendar.GridHeader;
export const RangeCalendarGridBody = HeroRangeCalendar.GridBody;
export const RangeCalendarHeaderCell = HeroRangeCalendar.HeaderCell;
export const RangeCalendarCell = HeroRangeCalendar.Cell;
export const RangeCalendarCellIndicator = HeroRangeCalendar.CellIndicator;
export const RangeCalendarYearPickerTrigger = HeroRangeCalendar.YearPickerTrigger;
export const RangeCalendarYearPickerTriggerHeading = HeroRangeCalendar.YearPickerTriggerHeading;
export const RangeCalendarYearPickerTriggerIndicator = HeroRangeCalendar.YearPickerTriggerIndicator;
export const RangeCalendarYearPickerGrid = HeroRangeCalendar.YearPickerGrid;
export const RangeCalendarYearPickerGridBody = HeroRangeCalendar.YearPickerGridBody;
export const RangeCalendarYearPickerCell = HeroRangeCalendar.YearPickerCell;

export const RangeCalendar = Object.assign(RangeCalendarBase, {
  Root: HeroRangeCalendar.Root,
  Header: HeroRangeCalendar.Header,
  Heading: HeroRangeCalendar.Heading,
  NavButton: HeroRangeCalendar.NavButton,
  Grid: HeroRangeCalendar.Grid,
  GridHeader: HeroRangeCalendar.GridHeader,
  GridBody: HeroRangeCalendar.GridBody,
  HeaderCell: HeroRangeCalendar.HeaderCell,
  Cell: HeroRangeCalendar.Cell,
  CellIndicator: HeroRangeCalendar.CellIndicator,
  YearPickerTrigger: HeroRangeCalendar.YearPickerTrigger,
  YearPickerTriggerHeading: HeroRangeCalendar.YearPickerTriggerHeading,
  YearPickerTriggerIndicator: HeroRangeCalendar.YearPickerTriggerIndicator,
  YearPickerGrid: HeroRangeCalendar.YearPickerGrid,
  YearPickerGridBody: HeroRangeCalendar.YearPickerGridBody,
  YearPickerCell: HeroRangeCalendar.YearPickerCell,
});
