"use client";
import { useEffect, useState } from "react";
import Calendar from "src/components/ui/calendar";
import { apiFetch } from "src/lib/api";

type EmojiType = {
  id: number;
  name: string;
  symbol: string;
};

export default function Journal() {
  const [images, setImages] = useState<{ [date: string]: string }>({});
  useEffect(() => {
    async function fetchEmojis() {
      try {
        const data = await apiFetch<EmojiType[]>("/api/emojis", {
          method: "Get",
          cache: "no-store", // always fresh
        });

        // Map emojis to demo dates (1st, 2nd, 3rd…)
        const today = new Date();
        const demoImages: { [key: string]: string } = {};
        data.forEach((item, i) => {
          const dateKey = new Date(today.getFullYear(), today.getMonth(), i + 1)
            .toISOString()
            .split("T")[0];
          demoImages[dateKey] = item.symbol; // emoji character
        });

        setImages(demoImages);
      } catch (err) {
        console.error("Failed to fetch emojis", err);
      }
    }

    fetchEmojis();
  }, []);
  return (
    <div className="color-bg justify-center items-center">
      <div className="flex items-center justify-center flex-col w-full">
        <h2 className="p-4 text-2xl">DAILY CHECK-IN</h2>
        <div className="w-full flex justify-center items-center">
          <Calendar
            images={images}
            fallbackEnabled={true}
            fallbackEmojiSrc="/assets/emojis/happy.png"
            onDateSelect={null}
          />
        </div>
      </div>
    </div>
  );
}
