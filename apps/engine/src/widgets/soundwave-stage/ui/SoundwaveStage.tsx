"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { soundwaveTracks, TrackCard } from "@/entities/soundwave";
import { BackToMenuLink, useEscapeKey, useRovingGridFocus } from "@/shared";
import { SoundwaveArena } from "./SoundwaveArena";

export function SoundwaveStage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selected = soundwaveTracks.find((track) => track.slug === selectedSlug) ?? null;
  const router = useRouter();

  // Escape backs out one level: arena -> track select -> engine menu.
  useEscapeKey(() => (selected ? setSelectedSlug(null) : router.push("/")));

  const { focusedIndex, setFocusedIndex, registerItemRef, handleKeyDown } =
    useRovingGridFocus<HTMLButtonElement>({
      itemCount: soundwaveTracks.length,
      columns: 1,
      isActive: selected === null,
    });

  return (
    <main className="p-4 sm:p-8">
      <BackToMenuLink />
      <h1 className="mt-2 text-arcade-green">SoundWave</h1>

      {selected ? (
        // Keyed so switching tracks remounts the session (and disposes audio).
        <SoundwaveArena
          key={selected.slug}
          track={selected}
          onExit={() => setSelectedSlug(null)}
        />
      ) : (
        <>
          <p className="mt-2 text-sm text-arcade-cyan">
            Pick a track — notes fall down four lanes, hit D F J K (or tap a lane) on the line.
          </p>
          <div className="mt-4 flex max-w-md flex-col gap-4">
            {soundwaveTracks.map((track, index) => (
              <TrackCard
                key={track.slug}
                ref={registerItemRef(index)}
                track={track}
                onSelect={(picked) => setSelectedSlug(picked.slug)}
                tabIndex={index === focusedIndex ? 0 : -1}
                onFocus={() => setFocusedIndex(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
