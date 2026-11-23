// A short fingerprint of a game's log, so a copied game can be checked to replay exactly as the player saw it.
// FNV-1a over the log's words, two 32-bit lanes; no crypto library, so it runs the same in the browser and in Node.
import type { GameState } from "./types.ts";

export function logDigest(s: GameState): string {
  let a = 0x811c9dc5, b = 0x01000193 ^ 0x5bd1e995;
  const text = JSON.stringify(s.log.map((e) => e.text)) + JSON.stringify(s.over ? { r: s.over.reason, s: s.over.season } : null);
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    a = Math.imul(a ^ c, 0x01000193) >>> 0;
    b = Math.imul(b ^ c, 0x5bd1e995) >>> 0;
  }
  return a.toString(16).padStart(8, "0") + b.toString(16).padStart(8, "0");
}
