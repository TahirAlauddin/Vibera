import { NextResponse } from "next/server";

// Define a type for data
type EmojiType = {
  id: number;
  name: string; // label
  symbol: string; // emoji character
};

// Real DB query OR mock data
const emojisDummyData: EmojiType[] = [
  { id: 1, name: "happy", symbol: "/assets/emojis/happy.png" },
  { id: 2, name: "angry", symbol: "/assets/emojis/angry.png" },
  { id: 3, name: "sad", symbol: "/assets/emojis/sad.png" },
  { id: 4, name: "calm", symbol: "/assets/emojis/calm.png" },
  { id: 3, name: "tired", symbol: "/assets/emojis/tired.png" },
  { id: 3, name: "anxious", symbol: "/assets/emojis/anxious.png" },
];

// Exported Get handler
export async function GET() {
  try {
    // later replace with db fetch
    return NextResponse.json<EmojiType[]>(emojisDummyData);
  } catch (err) {
    console.error("API error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
