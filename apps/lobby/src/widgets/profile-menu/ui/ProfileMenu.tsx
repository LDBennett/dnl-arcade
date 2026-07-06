"use client";

import { usePlayerName } from "@/entities/player";
import { useState } from "react";

export function ProfileMenu() {
  const { playerName, setPlayerName } = usePlayerName();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(playerName);

  if (editing) {
    return (
      <form
        className="fixed right-4 top-4 flex items-center gap-2 text-sm"
        onSubmit={(event) => {
          event.preventDefault();
          setPlayerName(draft);
          setEditing(false);
        }}
      >
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={24}
          autoFocus
          className="rounded border border-arcade-cyan bg-transparent px-2 py-1 text-arcade-cyan"
        />
        <button type="submit" className="text-arcade-cyan underline">
          Save
        </button>
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(playerName);
        setEditing(true);
      }}
      className="fixed right-4 top-4 rounded border border-arcade-cyan px-3 py-1 text-sm text-arcade-cyan shadow-neon hover:bg-arcade-cyan hover:text-arcade-bg"
    >
      {playerName}
    </button>
  );
}
