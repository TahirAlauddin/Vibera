import type { Metadata } from "next";
import "./globals.css";
import { Quicksand } from "next/font/google";
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-primary" });

export const metadata: Metadata = {
  title: "Vibera",
  description: "Mood Tracker social app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${quicksand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
