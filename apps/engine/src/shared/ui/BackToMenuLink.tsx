import Link from "next/link";

export function BackToMenuLink() {
  return (
    <Link
      href="/"
      className="inline-block text-sm text-arcade-cyan hover:text-arcade-amber"
    >
      &larr; Back to games
    </Link>
  );
}
