import { NextResponse } from "next/server";

// Define a type for data
type Emoji = {
  id: number;
  name: string; // label
  symbol: string; // emoji character
};

// Real DB query OR mock data
const emojis: Emoji[] = [
  { id: 1, name: "happy", symbol: "😀" },
  { id: 2, name: "neutral", symbol: "😐" },
  { id: 3, name: "sad", symbol: "😢" },
];

// Exported Get handler
export async function GET() {
  try {
    // later replace with db fetch
    return NextResponse.json<Emoji[]>(emojis);
  } catch (err) {
    console.error("API error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
