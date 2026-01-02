"use client";

import { useState } from "react";
import Image from "next/image";

/*
  Calendar Component
  Responsibilities:
  - Month navigation
  - Correct weekday alignment
  - Rendering days
  - Showing emoji from DB or fallback
*/

export default function Calendar({
  images = {}, // { "YYYY-MM-DD": emojiSrc }
  fallbackEnabled = false, // show default emoji if no DB emoji
  fallbackEmojiSrc = "", // default emoji image
  onDateSelect, // callback when a day is clicked
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const today = new Date();
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth(); // 0-based

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Shift Sunday to the end (UI starts Monday)
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;

  const cells = [];

  // Empty slots before day 1
  for (let i = 0; i < startDay; i++) cells.push(null);

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  // Navigation
  const goPrevMonth = () => setSelectedDate(new Date(year, month - 1, 1));
  const goNextMonth = () => setSelectedDate(new Date(year, month + 1, 1));

  return (
    <div className="p-4 w-full sm:w-3/4 md:w-1/2 lg:w-2/4 m-auto bg-white shadow-md rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goPrevMonth}
          className="text-lg font-bold hover:text-primary transition-colors"
        >
          ‹
        </button>

        <span className="text-lg font-semibold">
          {selectedDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>

        <button
          onClick={goNextMonth}
          className="text-lg font-bold hover:text-primary transition-colors"
        >
          ›
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 text-center text-sm font-medium mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="text-accent">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0 border border-gray-300">
        {cells.map((day, index) => {
          // Empty cell
          if (!day)
            return (
              <div
                key={index}
                className="min-w-11 aspect-square border border-gray-300"
              />
            );

          // Build YYYY-MM-DD key
          const dateKey = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;

          const cellDate = new Date(dateKey);

          return (
            <div
              key={index}
              className="relative aspect-square min-w-11 p-1 cursor-pointer border border-gray-300 hover:bg-gray-100 rounded-b-sm"
              onClick={() => onDateSelect?.(dateKey)}
            >
              {/* Day number */}
              <span className="absolute top-1 left-1 text-xs  font-medium text-gray-500">
                {day}
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Emoji rendering */}
                {images[dateKey] ? (
                  <Image
                    src={images[dateKey]}
                    alt="emoji"
                    width={32}
                    height={32}
                    className="w-5 h-5  
                    sm:w-6 sm:h-6
                    md:w-7 md:h-7
                    lg:w-8 lg:h-8 
                    "
                  />
                ) : (
                  fallbackEnabled &&
                  cellDate <= todayMidnight && (
                    <Image
                      src={fallbackEmojiSrc}
                      alt="default emoji"
                      width={15}
                      height={15}
                      className="w-4 h-4
                      sm:w-5  sm:h-5
                      lg:w-7  lg:h-7
                       opacity-60"
                    />
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
