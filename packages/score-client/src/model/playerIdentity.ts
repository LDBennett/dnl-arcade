export const PLAYER_NAME_STORAGE_KEY = "dnl-arcade:player-name";

export function getStoredPlayerName(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PLAYER_NAME_STORAGE_KEY);
}

export function setStoredPlayerName(name: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLAYER_NAME_STORAGE_KEY, name);
}

export function generateDefaultPlayerName(): string {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `Runner-${suffix}`;
}
