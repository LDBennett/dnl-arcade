import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RetroArcade Engine",
  description: "Isolated game sandbox for RetroArcade",
};

export default function EngineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen font-arcade">{children}</body>
    </html>
  );
}
