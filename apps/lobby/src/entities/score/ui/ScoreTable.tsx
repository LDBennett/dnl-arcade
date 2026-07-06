import type { ScoreEntry } from "@dnl-arcade/score-client";

export function ScoreTable({ entries }: { entries: ScoreEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-arcade-cyan/60">No scores yet.</p>;
  }

  return (
    <table className="w-full max-w-sm text-left text-sm">
      <tbody>
        {entries.map((entry, index) => (
          <tr key={entry.id} className="text-arcade-cyan">
            <td className="py-1 pr-4">{index + 1}</td>
            <td className="py-1 pr-4">{entry.playerName}</td>
            <td className="py-1">{entry.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
