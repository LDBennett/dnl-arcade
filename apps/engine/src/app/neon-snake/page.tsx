"use client";

import { useRouter } from "next/navigation";
import { BackToMenuLink, useAutoFocus, useEscapeKey } from "@/shared";

export default function NeonSnakePage() {
  const backLinkRef = useAutoFocus<HTMLAnchorElement>();
  const router = useRouter();

  useEscapeKey(() => router.push("/"));

  return (
    <main className="p-8">
      <BackToMenuLink ref={backLinkRef} />
      <h1 className="mt-2 text-arcade-green">Neon Snake</h1>
      <p className="mt-2 text-sm text-arcade-cyan">Coming soon.</p>
    </main>
  );
}
