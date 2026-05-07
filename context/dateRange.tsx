"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";

type DateRangeContextType = {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
};

export const DateRangeContext = React.createContext<DateRangeContextType>({
  date: undefined,
  setDate: () => {},
});

export const useDateRange = () => React.useContext(DateRangeContext);
