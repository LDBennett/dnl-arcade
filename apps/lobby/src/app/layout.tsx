import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RetroArcade",
  description: "The lobby gateway for RetroArcade",
};

export default function RootLayout({
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
