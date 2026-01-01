"use client";
import { Calendar } from "src/components/ui/calendar";

export default function Journal() {
  return (
    <div className="color-bg justify-center items-center">
      <div className="flex items-center justify-center flex-col bg-white w-full">
        <h2 className="p-4">DAILY CHECK-IN</h2>
        <Calendar />
      </div>
    </div>
  );
}
