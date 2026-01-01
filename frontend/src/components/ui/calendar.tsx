"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "src/lib/utils";
import { Button } from "src/components/ui/button";

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    setSelectedDate(new Date(year, month, day));
  };

  return (
    <div className="p-4 w-full sm:w-3/4 md:w-1/2 lg:w-1/2 bg-white shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
          &lt;
        </Button>
        <h2 className="text-lg font-semibold">
          {monthName} {year}
        </h2>
        <Button variant="ghost" size="sm" onClick={handleNextMonth}>
          &gt;
        </Button>
      </div>

      {/* Days of the week */}
      <div className="grid grid-cols-7  gap-1 text-center text-sm font-medium mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1 border border-b-gray-600">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <Button
            key={day}
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 text-sm",
              selectedDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year
                ? "bg-primary text-white"
                : ""
            )}
            onClick={() => handleDayClick(day)}
          >
            {day}
          </Button>
        ))}
      </div>
    </div>
  );
}
