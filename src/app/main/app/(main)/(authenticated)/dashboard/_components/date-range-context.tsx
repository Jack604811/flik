"use client"; // Ensure it's a client component

import React, { createContext, useContext, useState } from "react";
import { startOfMonth, endOfMonth } from "date-fns";

// Define the context types
type DateRangeContextType = {
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
};

// Create the context
const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

// Create a provider component
export const DateRangeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));

  return (
    <DateRangeContext.Provider value={{ startDate, endDate, setStartDate, setEndDate }}>
      {children}
    </DateRangeContext.Provider>
  );
};

// Create a custom hook to use the context
export const useDateRange = () => {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }
  return context;
};
