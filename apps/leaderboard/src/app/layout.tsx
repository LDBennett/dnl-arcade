import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RetroArcade Leaderboard",
  description: "High scores for RetroArcade",
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen font-arcade">
        <div className="crt-overlay" />
        <div className="crt-vignette" />
        {children}
      </body>
    </html>
  );
}
