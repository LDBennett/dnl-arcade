import type { Metadata } from "next";
// Suppress TS error for side-effect CSS import when no type declarations are present
// @ts-ignore: Module declaration for CSS not found
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
