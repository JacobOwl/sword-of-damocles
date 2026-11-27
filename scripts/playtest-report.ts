// Writes the playtest bot's tables and charts (results.md, outcomes.svg, survival.svg) from its results.
// Called by scripts/playtest.ts; everything here is read from the results, so a rerun with the same counts writes the same files.
import { writeFileSync } from "node:fs";
import { DATA, NODES, nodeName, eventById } from "../src/core/index.ts";
import { COURT_EVENTS, ISLAND_EVENTS, DINNER_EVENTS, EXILE_EVENTS, BOARD_EVENTS } from "../src/core/events.ts";
import type { EventDef } from "../src/core/index.ts";
import type { Agg } from "./playtest.ts";

type Rec = Record<string, number>;
interface Meta { games: number; sweepGames: number; setups: { id: string; name: string }[]; players: { id: string; name: string; summary: string }[] }
type Results = Record<string, Record<string, Agg>>;

const ENDINGS: [string, string][] = [
  ["survived", "won: held Syracuse to the end"], ["killed", "killed"], ["exiled", "driven into exile (game over)"], ["deposed", "deposed by a rival"],
  ["fallen", "Syracuse fell to Carthage"], ["exileEnd", "the decade ended with you in exile"], ["settled", "settled abroad for good"],
  ["fled", "fled (an event)"], ["abdicated", "gave up power (an event)"], ["unfinished", "unfinished"],
];
const endName = (k: string) => ENDINGS.find((x) => x[0] === k)?.[1] ?? k;
const pct = (a: number, n: number) => (n ? `${Math.round((100 * a) / n)}%` : "-");
const q = (xs: number[], f: number) => (xs.length ? xs[Math.min(xs.length - 1, Math.floor(f * xs.length))] : 0);
const sum = (r: Rec) => Object.values(r).reduce((a, b) => a + b, 0);
const actName = (id: string) => (DATA.actions as any[]).find((a) => a.id === id)?.name ?? id;
const evName = (id: string) => eventById(id)?.name ?? id;
const choiceLabel = (key: string) => {
  const [ev, ch] = key.split("/");
  const c = eventById(ev)?.choices?.find((x) => x.id === ch);
  return c ? c.label.replace(/\{([a-zA-Z:]+)\}/g, (_, r) => `[${r.split(":").pop()}]`) : ch;
};
const seatName = (id: string) => ({ assembly: "leader of the assembly", generalship: "generalship", fleet: "fleet", treasury: "treasury", mint: "mint", citadel: "citadel", captain: "captain of the guard" } as Record<string, string>)[id] ?? id;
const cityName = (id: string) => nodeName(id);

// Which deck an event is in, and the setups it can come up in at all.
const DECKS: [string, EventDef[], string | null][] = [
  ["court", COURT_EVENTS, null], ["island", ISLAND_EVENTS, null], ["dinner", DINNER_EVENTS, "dinners"], ["exile", EXILE_EVENTS, "exile"], ["board", BOARD_EVENTS, "contestedBoard"],
];
export function writeReport(out: string, meta: Meta, results: Results, info: Record<string, { scenario: string; switches: string[] }>) {
  const L: string[] = [];
  const P = meta.players.map((p) => p.id);
  const setups = meta.setups.filter((s) => results[s.id]);
  const allMain = (fn: (a: Agg, setup: string, player: string) => void) => { for (const s of setups) for (const p of P) if (results[s.id][p]) fn(results[s.id][p], s.id, p); };
  const allAny = (fn: (a: Agg, setup: string, player: string) => void) => { for (const s of setups) for (const [p, a] of Object.entries(results[s.id])) fn(a, s.id, p); };
  let games = 0, sweepGames = 0;
  allAny((a, _s, p) => { if (p.startsWith("only:")) sweepGames += a.n; else games += a.n; });

  L.push("# Playtest bot: the numbers", "");
  L.push(`Written by \`npm run playtest\` (scripts/playtest.ts). ${games} games by ${P.length} kinds of player (seeds 1 to ${meta.games} for each setup and player), and ${sweepGames} games in the one-action sweep (seeds 1 to ${meta.sweepGames} for each action). The plain-words summary and the fix ideas are in \`report.md\` beside this file. Any game here replays with \`npm run playtest -- --one <setup>:<player>:<seed>\`.`, "");
  L.push("## The setups", "");
  for (const s of setups) L.push(`- **${s.id}**: ${s.name}.`);
  L.push("", "## The players", "");
  for (const p of meta.players) L.push(`- **${p.id}** (${p.name}): ${p.summary}`);
  L.push("- **only:<action>** (the sweep): takes that one action whenever any target makes it legal and does nothing else; matters take their default.");

  // ---------- Problems ----------
  L.push("", "## Problems found", "");
  L.push("Checked in every game: crashes; the game's own broken-state check after every season (not only at the end); a season that cannot end or a game that never ends; more than 20 actions in one season (an action that costs nothing); replaying the recorded inputs must give the same game; the state must stay plain data (no NaN, no class objects).", "");
  const kinds = new Set<string>();
  allAny((a) => Object.keys(a.issueCounts).forEach((k) => kinds.add(k)));
  if (!kinds.size) L.push("None, in any setup or player.");
  else {
    L.push(`| setup | player | ${[...kinds].join(" | ")} |`, `|---|---|${[...kinds].map(() => "---").join("|")}|`);
    allAny((a, s, p) => { if (Object.keys(a.issueCounts).length) L.push(`| ${s} | ${p} | ${[...kinds].map((k) => a.issueCounts[k] ?? 0).join(" | ")} |`); });
    L.push("", "Examples (up to five of each kind in each setup), with the command that replays the game:", "");
    for (const k of kinds) for (const s of setups) {
      const ex: string[] = [];
      for (const [p, a] of Object.entries(results[s.id])) for (const x of a.issues) if (x.kind === k && ex.length < 5) ex.push(`- ${s.id}, ${p}, seed ${x.seed}, season ${x.season + 1}: ${x.text} \`npm run playtest -- --one ${s.id}:${p}:${x.seed}\``);
      if (ex.length) L.push(`**${k}** in ${s.id}:`, "", ...ex, "");
    }
  }
  const noSlot: string[] = [];
  allMain((a, s, p) => { if (a.maxNoSlotRun >= 3) noSlot.push(`${s}/${p} (longest run ${a.maxNoSlotRun})`); });
  L.push("", `Seasons that began with no action left to take: ${noSlot.length ? `runs of three or more in ${noSlot.join(", ")}.` : "never three in a row."} Seasons with actions left but nothing legal on the menu: ${(() => { let n = 0; allAny((a) => { n += a.stuckSeasons; }); return n; })()}.`);

  // ---------- Outcomes ----------
  L.push("", "## How games end", "", "Won means the decade ended with you still holding Syracuse. Length is seasons played (40 is the whole decade). \"Still playing\" counts games not yet over at the end of season 10, 20 and 30; in the exile setups that includes playing on in exile. The chart is `outcomes.svg`.", "");
  L.push("![How games end, by setup and player](outcomes.svg)", "");
  for (const s of setups) {
    L.push(`### ${s.id}: ${s.name}`, "");
    const ends = new Set<string>();
    for (const p of P) Object.keys(results[s.id][p]?.ends ?? {}).forEach((k) => ends.add(k));
    const cols = ENDINGS.map((x) => x[0]).filter((k) => ends.has(k));
    L.push(`| player | games | ${cols.map(endName).join(" | ")} | median length | 1 in 10 over by | still playing at 10 / 20 / 30 | ever a tyranny |`);
    L.push(`|---|---|${cols.map(() => "---").join("|")}|---|---|---|---|`);
    for (const p of P) {
      const a = results[s.id][p]; if (!a) continue;
      L.push(`| ${p} | ${a.n} | ${cols.map((k) => pct(a.ends[k] ?? 0, a.n)).join(" | ")} | ${q(a.lengths, 0.5)} | ${q(a.lengths, 0.1)} | ${["10", "20", "30"].map((k) => pct(a.alive[k] ?? 0, a.n)).join(" / ")} | ${pct(a.tyranny, a.n)} |`);
    }
    const by: Rec = {};
    for (const p of P) for (const [k, v] of Object.entries(results[s.id][p]?.by ?? {})) by[k] = (by[k] ?? 0) + v;
    const top = Object.entries(by).sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0])).slice(0, 5);
    if (top.length) L.push("", `Who ended the rule most often (all players together): ${top.map(([k, v]) => `${k} ${v}`).join(", ")}.`);
    L.push("");
  }
  L.push("![How long each kind of player lasts](survival.svg)", "");
  const always: string[] = [], never: string[] = [];
  allMain((a, s, p) => { if (a.n && a.wins / a.n >= 0.9) always.push(`${p} in ${s} (${pct(a.wins, a.n)})`); });
  allMain((a, s, p) => { if (a.n && !a.wins) never.push(`${p} in ${s}`); });
  L.push(`Players that win nine games in ten or more: ${always.length ? always.join(", ") : "none"}.`, "");
  L.push(`Players that never won a game: ${never.length ? never.join(", ") : "none"}.`, "");

  // ---------- The sweep ----------
  L.push("## The one-action sweep", "", `Each action played alone, ${meta.sweepGames} games each, against doing nothing at all (idle, same seeds). An action that wins or lasts far longer on its own is either very strong or a hole.`, "");
  for (const s of setups) {
    const idle = results[s.id].idle;
    const rows = Object.entries(results[s.id]).filter(([p]) => p.startsWith("only:")).map(([p, a]) => ({ id: p.slice(5), a, med: q(a.lengths, 0.5) }));
    if (!rows.length) continue;
    rows.sort((x, y) => y.a.wins / y.a.n - x.a.wins / x.a.n || y.med - x.med || x.id.localeCompare(y.id));
    const base = idle ? `idle wins ${pct(idle.wins, idle.n)}, median length ${q(idle.lengths, 0.5)}` : "no idle run";
    L.push(`### ${s.id} (${base})`, "");
    L.push("| action alone | wins | median length | 1 in 10 over by | most common end |", "|---|---|---|---|---|");
    // Only actions the sweep player could take at least once: the rest played the same game as idle.
    const used = rows.filter((r) => sum(r.a.actTaken));
    const line = (r: (typeof rows)[number]) => {
      const e = Object.entries(r.a.ends).sort((x, y) => y[1] - x[1])[0];
      return `| ${actName(r.id)} (\`${r.id}\`) | ${pct(r.a.wins, r.a.n)} | ${r.med} | ${q(r.a.lengths, 0.1)} | ${e ? `${endName(e[0])} ${pct(e[1], r.a.n)}` : "-"} |`;
    };
    for (const r of used.slice(0, 8)) L.push(line(r));
    const worst = used.slice(8).sort((x, y) => x.med - y.med || x.a.wins / x.a.n - y.a.wins / y.a.n || x.id.localeCompare(y.id)).slice(0, 3);
    if (used.length > 8) { L.push("| ... the shortest-lived: | | | | |"); for (const r of worst) L.push(line(r)); }
    const never2 = rows.filter((r) => !sum(r.a.actTaken)).map((r) => actName(r.id));
    if (never2.length) L.push("", `Never once taken by its sweep player in this setup (it needs something only other actions bring about, such as an army in the field or a seat on the council): ${never2.join(", ")}.`);
    L.push("");
  }

  // ---------- What never happens ----------
  L.push("## What never happens", "");
  const seen: Rec = {};
  allAny((a) => { for (const [k, v] of Object.entries(a.ends)) seen[k] = (seen[k] ?? 0) + v; });
  L.push(`**Endings.** Seen: ${ENDINGS.filter((x) => seen[x[0]]).map((x) => `${x[1]} ${seen[x[0]]}`).join(", ")}. Never seen: ${ENDINGS.filter((x) => !seen[x[0]] && x[0] !== "unfinished").map((x) => x[1]).join(", ") || "none"}.`, "");
  const exEnds: Rec = {};
  allAny((a) => { for (const [k, v] of Object.entries(a.exileEnds)) exEnds[k] = (exEnds[k] ?? 0) + v; });
  if (sum(exEnds)) L.push(`How exiles ended: ${Object.entries(exEnds).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k} ${v}`).join(", ")}.`, "");

  // Events.
  const fired: Rec = {}, fires: Rec = {}, gamesFor: Rec = {};
  allAny((a, s) => { for (const [k, v] of Object.entries(a.evFired)) fired[k] = (fired[k] ?? 0) + v; for (const [k, v] of Object.entries(a.evFires)) fires[k] = (fires[k] ?? 0) + v; gamesFor[s] = (gamesFor[s] ?? 0) + a.n; });
  const possibleIn = (def: EventDef, deckSwitch: string | null) => setups.filter((s) => {
    const x = info[s.id]; if (!x) return true;
    if (def.scenario && def.scenario !== x.scenario) return false;
    if (deckSwitch && !x.switches.includes(deckSwitch)) return false;
    if (def.when?.switchOn && !x.switches.includes(def.when.switchOn)) return false;
    if (def.when?.switchOff && x.switches.includes(def.when.switchOff)) return false;
    return true;
  }).map((s) => s.id);
  L.push("**Events (matters and news) that never fired** in any setup where they can come up at all. \"Chained\" events come only as a follow-up or from a system (a dinner, the board, exile), never by chance.", "");
  let total = 0, dead = 0;
  for (const [deck, defs, sw] of DECKS) {
    const rows: string[] = [], off: string[] = [];
    for (const d of defs) {
      total++;
      const where = possibleIn(d, sw);
      if (!where.length) { off.push(d.name); continue; }
      if (!fired[d.id]) { dead++; rows.push(`- ${d.name} (\`${d.id}\`${d.chained ? ", chained" : ""}; could come up in ${where.join(", ")})`); }
    }
    L.push(`*${deck} deck* (${defs.length} events): ${rows.length ? `${rows.length} never fired:` : "every one fired at least once."}`);
    if (rows.length) L.push("", ...rows);
    if (off.length) L.push("", `Not possible in any tested setup: ${off.join(", ")}.`);
    L.push("");
  }
  const rare = Object.entries(fired).filter(([, v]) => v <= 3).sort((x, y) => x[1] - y[1] || x[0].localeCompare(y[0]));
  L.push(`${dead} of ${total} events never fired. Rare (in three games or fewer, of ${games + sweepGames}): ${rare.length ? rare.map(([k, v]) => `${evName(k)} ${v}`).join(", ") : "none"}.`, "");

  // Choices.
  const picked: Rec = {}, defaulted: Rec = {}, offered: Rec = {}, blockedAll: Rec = {};
  allAny((a) => {
    for (const [k, v] of Object.entries(a.chPicked)) picked[k] = (picked[k] ?? 0) + v;
    for (const [k, v] of Object.entries(a.chDefaulted)) defaulted[k] = (defaulted[k] ?? 0) + v;
    for (const [k, v] of Object.entries(a.chOffered)) offered[k] = (offered[k] ?? 0) + v;
    for (const [k, v] of Object.entries(a.allBlocked)) blockedAll[k] = (blockedAll[k] ?? 0) + v;
  });
  const neverOpen: string[] = [], neverTaken: string[] = [];
  for (const [, defs] of DECKS) for (const d of defs) {
    if (!fired[d.id]) continue;
    for (const c of d.choices ?? []) {
      const k = `${d.id}/${c.id}`;
      if (!offered[k]) neverOpen.push(`${d.name}: "${choiceLabel(k)}"`);
      else if (!picked[k] && !defaulted[k]) neverTaken.push(`${d.name}: "${choiceLabel(k)}"`);
    }
  }
  L.push(`**Answers never open.** Of the events that fired, these answers were never once available (their condition or cost never met when the matter was up): ${neverOpen.length ? "" : "none."}`);
  if (neverOpen.length) L.push("", ...neverOpen.map((x) => `- ${x}`));
  L.push("", `**Answers open but never taken** by any player, even the random one: ${neverTaken.length ? neverTaken.join("; ") : "none"}.`, "");
  const ab = Object.entries(blockedAll).sort((x, y) => y[1] - x[1]);
  L.push(`**Matters with every answer closed** (they vanish at the end of the season with no effect): ${ab.length ? ab.map(([k, v]) => `${evName(k)} ${v} times`).join(", ") : "none"}.`, "");

  // Actions.
  L.push("**Actions never legal**, by setup (never once offered on the menu to any player):", "");
  for (const s of setups) {
    const x = info[s.id];
    const off: Rec = {};
    for (const a of Object.values(results[s.id])) for (const [k, v] of Object.entries(a.actOffered)) off[k] = (off[k] ?? 0) + v;
    const scope = (DATA.actions as any[]).filter((a) => !a.aiOnly && (!x || ((!a.scenario || a.scenario === x.scenario) && (!a.switch || x.switches.includes(a.switch)) && (!a.exile || x.switches.includes("exile")))));
    const nv = scope.filter((a) => !off[a.id]).map((a) => a.name);
    L.push(`- ${s.id}: ${nv.length ? nv.join(", ") : "every action was legal at some point"}.`);
  }
  // Petitions.
  const kinds2: Rec = {}, ref: Rec = {}, lap: Rec = {}, ans: Rec = {};
  allAny((a) => { for (const [k, v] of Object.entries(a.reqKinds)) kinds2[k] = (kinds2[k] ?? 0) + v; for (const [k, v] of Object.entries(a.reqRefused)) ref[k] = (ref[k] ?? 0) + v; for (const [k, v] of Object.entries(a.reqLapsed)) lap[k] = (lap[k] ?? 0) + v; for (const [k, v] of Object.entries(a.reqAnswered)) ans[k] = (ans[k] ?? 0) + v; });
  const allKinds = ["office", "silver", "citizenship", "marriage", "land"];
  L.push("", `**Petitions** (the old asks; the board's petitions are events above). Seen by kind, with how they were met: ${allKinds.filter((k) => kinds2[k]).map((k) => `${k} ${kinds2[k]} (answered ${ans[k] ?? 0}, refused ${ref[k] ?? 0}, left to lapse ${lap[k] ?? 0})`).join("; ")}. Never seen: ${allKinds.filter((k) => !kinds2[k]).join(", ") || "none"}.`, "");
  // Seats and cities.
  L.push("**Seats changing hands**: the share of games with at least one change of holder, all players (a seat at 0% never changes):", "");
  for (const s of setups) {
    const ch: Rec = {}, g: Rec = {}; let n = 0;
    for (const [p, a] of Object.entries(results[s.id])) { if (p.startsWith("only:")) continue; n += a.n; for (const [k, v] of Object.entries(a.seatChanges)) ch[k] = (ch[k] ?? 0) + v; for (const [k, v] of Object.entries(a.seatGames)) g[k] = (g[k] ?? 0) + v; }
    const seats = info[s.id]?.switches.includes("contestedBoard") ? ["assembly", "generalship", "fleet", "treasury", "mint", "captain", "citadel"] : ["assembly", "generalship", "fleet", "treasury", "mint", "citadel"];
    L.push(`- ${s.id}: ${seats.map((k) => `${seatName(k)} ${pct(g[k] ?? 0, n)}`).join(", ")}.${seats.filter((k) => !ch[k]).length ? ` Never: ${seats.filter((k) => !ch[k]).map(seatName).join(", ")}.` : ""}`);
  }
  L.push("", "**Towns that never changed sides** (island setups):", "");
  for (const s of setups) {
    const g: Rec = {}; let n = 0;
    for (const [p, a] of Object.entries(results[s.id])) { if (p.startsWith("only:")) continue; n += a.n; for (const [k, v] of Object.entries(a.cityGames)) g[k] = (g[k] ?? 0) + v; }
    if (info[s.id]?.scenario !== "island") continue;
    const list = NODES.map((x) => x.id);
    L.push(`- ${s.id}: ${list.map((k) => `${cityName(k)} ${pct(g[k] ?? 0, n)}`).join(", ")}.${list.filter((k) => !g[k]).length ? ` Never: ${list.filter((k) => !g[k]).map(cityName).join(", ")}.` : ""}`);
  }

  // ---------- Answers that matter ----------
  L.push("", "## Answers that seem to matter", "", "From the careful player who answers every matter at random (`carefulDice`). For each matter answered both ways in at least 20 games, the win rate after each answer. This is a correlation, not proof: an answer can look good because it is only open when things already go well.", "");
  for (const s of setups) {
    const a = results[s.id].carefulDice; if (!a) continue;
    const byEv: Record<string, [string, number, number][]> = {};
    for (const [k, g] of Object.entries(a.chGames)) { if (g < 20) continue; const ev = k.split("/")[0]; (byEv[ev] ??= []).push([k, a.chWin[k] ?? 0, g]); }
    const gaps: { ev: string; hi: [string, number, number]; lo: [string, number, number]; gap: number }[] = [];
    for (const [ev, cs] of Object.entries(byEv)) {
      if (cs.length < 2) continue;
      const sorted = cs.slice().sort((x, y) => y[1] / y[2] - x[1] / x[2] || x[0].localeCompare(y[0]));
      const hi = sorted[0], lo = sorted.at(-1)!;
      gaps.push({ ev, hi, lo, gap: hi[1] / hi[2] - lo[1] / lo[2] });
    }
    gaps.sort((x, y) => y.gap - x.gap || x.ev.localeCompare(y.ev));
    if (!gaps.length) continue;
    L.push(`### ${s.id} (this player wins ${pct(a.wins, a.n)} overall)`, "", "| matter | better answer | wins after it | worse answer | wins after it |", "|---|---|---|---|---|");
    for (const g of gaps.slice(0, 6)) L.push(`| ${evName(g.ev)} | ${choiceLabel(g.hi[0])} | ${pct(g.hi[1], g.hi[2])} of ${g.hi[2]} | ${choiceLabel(g.lo[0])} | ${pct(g.lo[1], g.lo[2])} of ${g.lo[2]} |`);
    L.push("");
  }
  writeFileSync(`${out}/results.md`, L.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n");
  writeFileSync(`${out}/outcomes.svg`, outcomesSvg(meta, results));
  writeFileSync(`${out}/survival.svg`, survivalSvg(meta, results));
}

// ---------- Charts (light surface, the reference palette's first seven slots, validated for stacked bars) ----------
const GROUPS: [string, string[], string][] = [
  ["Won", ["survived"], "#257de0"], ["Killed", ["killed"], "#f47230"], ["Exiled, fled or settled abroad", ["exiled", "fled", "settled"], "#00b894"],
  ["Deposed", ["deposed"], "#f2a600"], ["Fell to Carthage", ["fallen"], "#ee7fac"], ["Decade ended in exile", ["exileEnd"], "#008a17"], ["Other", [], "#6a4ce2"],
];
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const FONT = `font-family="system-ui, -apple-system, Segoe UI, sans-serif"`;
function outcomesSvg(meta: Meta, results: Results): string {
  const setups = meta.setups.filter((s) => results[s.id]);
  const P = meta.players.map((p) => p.id);
  const W = 860, left = 150, barW = W - left - 30, rowH = 18, gap = 6, head = 26;
  let y = 64;
  const parts: string[] = [];
  for (const s of setups) {
    parts.push(`<text x="16" y="${y + 14}" font-size="13" font-weight="600" fill="#191919">${esc(s.id)}: ${esc(s.name.replace(/ \(.*$/, ""))}</text>`);
    y += head;
    for (const p of P) {
      const a = results[s.id][p]; if (!a) continue;
      parts.push(`<text x="${left - 8}" y="${y + 13}" font-size="12" fill="#666666" text-anchor="end">${esc(p)}</text>`);
      let x = left;
      const known = new Set(GROUPS.flatMap((g) => g[1]));
      for (const [name, keys, color] of GROUPS) {
        const n = keys.length ? keys.reduce((t, k) => t + (a.ends[k] ?? 0), 0) : Object.entries(a.ends).filter(([k]) => !known.has(k)).reduce((t, [, v]) => t + v, 0);
        if (!n) continue;
        const w = (barW * n) / a.n;
        parts.push(`<rect x="${(x + 1).toFixed(1)}" y="${y}" width="${Math.max(0.5, w - 2).toFixed(1)}" height="${rowH}" rx="2" fill="${color}"><title>${esc(`${s.id}, ${p}: ${name} ${Math.round((100 * n) / a.n)}% (${n} of ${a.n})`)}</title></rect>`);
        if (w >= 34) parts.push(`<text x="${(x + w / 2).toFixed(1)}" y="${y + 13}" font-size="11" fill="#ffffff" text-anchor="middle">${Math.round((100 * n) / a.n)}%</text>`);
        x += w;
      }
      y += rowH + gap;
    }
    y += 10;
  }
  const leg: string[] = [];
  let lx = 16, ly = 34;
  for (const [name, , color] of GROUPS) {
    const w = 22 + name.length * 6.6;
    if (lx + w > W - 16) { lx = 16; ly += 18; }
    leg.push(`<rect x="${lx}" y="${ly - 10}" width="12" height="12" rx="2" fill="${color}"/><text x="${lx + 17}" y="${ly}" font-size="12" fill="#191919">${esc(name)}</text>`);
    lx += w + 14;
  }
  const H = y + 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" ${FONT}>\n<rect width="${W}" height="${H}" fill="#ffffff"/>\n<text x="16" y="18" font-size="15" font-weight="600" fill="#191919">How games end, share of ${meta.games} games for each setup and player</text>\n${leg.join("\n")}\n${parts.join("\n")}\n</svg>\n`;
}

const LINE = ["#257de0", "#f47230", "#00b894", "#f2a600", "#ee7fac", "#008a17", "#6a4ce2"];
function survivalSvg(meta: Meta, results: Results): string {
  const setups = meta.setups.filter((s) => results[s.id]);
  const P = meta.players.map((p) => p.id);
  const cols = 3, pw = 270, ph = 170, padL = 34, padB = 24, padT = 22, W = cols * pw + 20;
  const rows = Math.ceil(setups.length / cols), top = 60;
  const H = top + rows * (ph + padT + padB) + 10;
  const parts: string[] = [];
  setups.forEach((s, i) => {
    const ox = 10 + (i % cols) * pw, oy = top + Math.floor(i / cols) * (ph + padT + padB);
    const iw = pw - padL - 14, ih = ph;
    const X = (season: number) => ox + padL + (iw * season) / 40, Y = (share: number) => oy + padT + ih * (1 - share);
    parts.push(`<text x="${ox + padL}" y="${oy + 14}" font-size="12" font-weight="600" fill="#191919">${esc(s.id)}</text>`);
    for (const v of [0, 0.5, 1]) parts.push(`<line x1="${X(0)}" x2="${X(40)}" y1="${Y(v)}" y2="${Y(v)}" stroke="#e5e5e5" stroke-width="1"/><text x="${X(0) - 4}" y="${Y(v) + 4}" font-size="10" fill="#666666" text-anchor="end">${v * 100}%</text>`);
    for (const t of [0, 10, 20, 30, 40]) parts.push(`<text x="${X(t)}" y="${oy + padT + ih + 14}" font-size="10" fill="#666666" text-anchor="middle">${t}</text>`);
    P.forEach((p, k) => {
      const a = results[s.id][p]; if (!a || !a.n) return;
      const pts: string[] = [];
      for (let t = 0; t <= 40; t++) pts.push(`${X(t).toFixed(1)},${Y(a.lengths.filter((x) => x > t || (x >= 40 && t === 40)).length / a.n).toFixed(1)}`);
      parts.push(`<polyline points="${pts.join(" ")}" fill="none" stroke="${LINE[k % LINE.length]}" stroke-width="2" stroke-linejoin="round"><title>${esc(`${s.id}, ${p}: still playing after each season`)}</title></polyline>`);
    });
  });
  const leg: string[] = [];
  let lx = 16;
  P.forEach((p, k) => { leg.push(`<line x1="${lx}" x2="${lx + 16}" y1="38" y2="38" stroke="${LINE[k % LINE.length]}" stroke-width="2"/><text x="${lx + 21}" y="42" font-size="12" fill="#191919">${esc(p)}</text>`); lx += 30 + p.length * 7; });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" ${FONT}>\n<rect width="${W}" height="${H}" fill="#ffffff"/>\n<text x="16" y="18" font-size="15" font-weight="600" fill="#191919">Share of games still going after each season (0 to 40), by setup and player</text>\n${leg.join("\n")}\n${parts.join("\n")}\n</svg>\n`;
}
