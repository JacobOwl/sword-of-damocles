// Onboarding: the first-season guide, the "How to play" page, and the tooltips (data-tip="key").
// The words here explain rules that live in src/core and data/; if a rule changes there, change its line here.
import { DATA, knobsFor } from "../../src/core/index.ts";
import { esc, ui } from "../lib/text.ts";
import type { Handlers } from "../app/clicks.ts";

export const TIPS: Record<string, string> = {
  silver: "Silver, in talents. You spend it on feasts, bribes, mercenaries, envoys and building. The guard's pay comes out of it each season. Levies, striking coin and raids bring it in.",
  grain: "Months of grain in the city's stores. It falls by 2 each season. The summer harvest adds 6, and a friendly fleet brings 2 each winter. Under 3 months, the hungry may riot.",
  anger: "Carthage's anger toward Syracuse, 0 to 10. It rises 1 each summer, and more when you take Carthage's towns or its tribute. Carthage's council reads it: high anger pushes its blocs toward war. See The island.",
  carthage: "The Carthage clock. It rises 1 each summer, and more for riots or attacks on Carthage's towns. At 10 a Carthaginian army lands.",
  land: "Portions of land you can hand out: to a faction, or to the guard as pay or citizenship.",
  guard: "Your mercenary guard. While it is paid and not too angry, its strength counts toward your defense. Unpaid, it can sell itself to a plot.",
  defense: "What a plot must beat when it strikes: a base of 4, plus the guard if it defends you, plus the citadel once built and held, plus watches on plotters.",
  influence: "Your political weight: one for each office you hold, plus half the power of the faction that backs you most. Anyone whose influence comes within 3 of yours (under Standard balance; the other packages may differ) may become a political rival.",
  government: "Who holds the offices decides the government. Hold the citadel, the generalship and the treasury at once and it is a tyranny.",
  actions: "You take three actions each season. Granting a petition also uses one.",
  power: "Faction power, 0 to 10. Marginal at 0 to 2, Active at 3 to 7, Dominant at 8 to 10. Each office a member holds adds 1. A Dominant faction backing a plot makes it far stronger.",
  mood: "A faction's mood toward you, from Rebellious to Loyal. At Angry or worse it may back a plot against you.",
  agenda: "A faction's scheme over several seasons. It moves a step forward whether or not you act. Work against it to slow it.",
  opinion: "What this person thinks of you, from −3 (hates you) to +3 (devoted). Gifts, offices and favours raise it; refusals, arrests and seizures lower it.",
  stage: "Plots pass three warnings: Whispers, then Rumors (you learn the faction), then Named (you learn a name). A plot needs at least a season at each, and strength 6 (under Standard balance), before it can strike.",
  enemy: "An enemy is made by a wound: a failed arrest, exile, a killed kinsman, public humiliation, or a failed plot they survived. Enemies rank up from Malcontent to Nemesis, and remember what you did.",
  political: "A political rival wants your place, not your life. They rise from Contender to Pretender, and a Pretender can depose you.",
  reach: "Reaches outside the city. These actions need the fleet or the army, or an envoy.",
  real: "A real person, named in the ancient sources. Open their sheet to see the passages.",
  invented: "Invented for the game, where the sources name no one.",
  rank: "Enemy ranks: Malcontent can start a plot; Schemer adds +1 to a plot; Faction leader adds +2 and needs no faction; Nemesis adds +3 and works openly for your fall.",
};

export function tipAttr(key: string) {
  return `data-tip="${esc(key)}" tabindex="0"`;
}

// One floating tooltip, for mouse, keyboard and touch.
export function installTips() {
  const tip = document.createElement("div");
  tip.className = "tip";
  tip.setAttribute("role", "tooltip");
  tip.hidden = true;
  document.body.appendChild(tip);
  let current: HTMLElement | null = null;
  const show = (el: HTMLElement) => {
    const key = el.dataset.tip!;
    const text = el.dataset.tipText ?? TIPS[key] ?? key; // data-tip-text: a tip built for this moment (the ledger's breakdowns)
    tip.textContent = text;
    tip.hidden = false;
    current = el;
    const r = el.getBoundingClientRect();
    const w = Math.min(320, window.innerWidth - 24);
    tip.style.maxWidth = `${w}px`;
    const left = Math.max(12, Math.min(window.innerWidth - w - 12, r.left));
    tip.style.left = `${left + window.scrollX}px`;
    const below = r.bottom + 8 + tip.offsetHeight < window.innerHeight;
    tip.style.top = `${(below ? r.bottom + 6 : r.top - tip.offsetHeight - 6) + window.scrollY}px`;
  };
  const hide = () => { tip.hidden = true; current = null; };
  document.addEventListener("mouseover", (e) => { const el = (e.target as HTMLElement).closest<HTMLElement>("[data-tip]"); if (el) show(el); else if (current) hide(); });
  document.addEventListener("focusin", (e) => { const el = (e.target as HTMLElement).closest<HTMLElement>("[data-tip]"); if (el) show(el); });
  document.addEventListener("focusout", hide);
  document.addEventListener("click", (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-tip]");
    if (el && el.tagName !== "BUTTON" && !el.closest("button")) { if (current === el && !tip.hidden) hide(); else show(el); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
  window.addEventListener("scroll", hide, { passive: true });
}

// ---------- First-season guide ----------
// The island has its own guide (the map, Carthage, the moods), remembered apart from the citadel's,
// so a player who dismissed the old one still sees it on his first island game.
const GUIDE_KEY = "sword-of-damocles-guide-done";
const ISLAND_KEY = "sword-of-damocles-island-guide-done";
const key = () => (ui.s?.island ? ISLAND_KEY : GUIDE_KEY);
export function guideDone() { try { return localStorage.getItem(key()) === "1"; } catch { return false; } }
export function setGuideDone(v: boolean) { try { if (v) localStorage.setItem(key(), "1"); else localStorage.removeItem(key()); } catch { /* storage may be blocked */ } }

// Folded to one line once dismissed, so it never sits in the way of the turn (AI testers' suggestion 6).
export function guide(open = true) {
  const g = ui.s;
  const head = (t: string) => `<summary><span class="label">${t}</span>${open ? ` <button type="button" id="guide-done">Got it</button>` : ` <span class="small muted">open for the six steps</span>`}</summary>`;
  if (g?.island) return `<details class="guide" aria-label="Your first season on the island"${open ? " open" : ""}>
    ${head("Your first season")}
    <ol>
      <li><b>Answer what needs you.</b> Matters and petitions come first. The people, the factions, the towns and Carthage have already moved; their moves, each with its reason, are folded at the foot of the page.</li>
      <li><b>Take three actions.</b> Open one to see its target, its cost and your exact odds before you commit. The army is an action too: muster it, send it, storm a wall.</li>
      <li><b>Watch the sword.</b> The sword over the title hangs lower as a plot you know of ripens. Plots warn you three times (Whispers, Rumors, Named) and grow from what you do to people. The Dangers column says who and why.</li>
      <li><b>Look at the map.</b> The island tab shows the eight cities, who holds each, every army, and what Carthage wants now. Carthage's anger, in the ledger, is what its council reads when it chooses war.</li>
      <li><b>Mind the moods.</b> Each faction runs from Rebellious to Loyal. ${knobsFor(g.tuning).contentFactionsStall ? "A faction that is Content or Loyal holds back its agenda against you; neglect it and the agenda marches on." : "An angry faction feeds plots."}</li>
      <li><b>Click any name</b> to see what that person thinks of you and why. Then <b>end the season</b>.</li>
    </ol>
  </details>`;
  return `<details class="guide" aria-label="How a season works"${open ? " open" : ""}>
    ${head("How a season works")}
    <ol>
      <li><b>Answer what needs you.</b> Matters and petitions come first. The people and factions have already moved; their moves, each with its reason, are folded at the foot of the page.</li>
      <li><b>Answer the petitions.</b> Granting one uses an action. Refusing in public costs you their goodwill, and a second refusal makes an enemy.</li>
      <li><b>Take up to three actions.</b> Open one to see its target, its cost and your exact odds before you commit.</li>
      <li><b>Watch the dangers</b> (the right-hand column, or the Dangers tab on a phone). Plots warn you three times before they strike: Whispers, Rumors, Named. Rivals grow out of what you do to people.</li>
      <li><b>Click any name</b> to open that person's sheet: what they think of you and why, their traits, their family, and what you can do to them.</li>
      <li><b>End the season</b> when you are done. Hold Syracuse until the summer of 395.</li>
    </ol>
  </details>`;
}

// ---------- How to play ----------
export function howToPlay() {
  const areas = DATA.areas.map((a: string) => `<li><b>${esc(a)}:</b> ${esc(DATA.actions.filter((x) => x.area === a && !x.aiOnly).map((x) => x.name).join(", "))}.</li>`).join("");
  const t = (k: string, label: string) => `<dt>${esc(label)}</dt><dd>${esc(TIPS[k])}</dd>`;
  return `<article class="howto">
    <h2>How to play</h2>
    <p>You are Dionysius, autumn 405 BC: a scribe who made himself general with supreme power. Each season is three months. The game runs forty seasons, to the summer of 395. You lose if a plot kills or exiles you, a political rival deposes you, or Carthage takes the city.</p>
    <h3>A season, in order</h3>
    <p>The world turns (grain, Carthage, income). The people act. The factions act. Then you act. Then power changes hands, then the sword: every plot is checked and may strike. The chronicle records what was seen.</p>
    <h3>Your actions</h3>
    <ul>${areas}</ul>
    <p>Most actions are one die plus modifiers, and 4 or more succeeds. Every modifier is shown before you commit. Some actions need no roll.</p>
    <h3>Plots and the sword</h3>
    <p>A plot forms from grudges and anger. You get three warnings: <i>Whispers</i> (something is off), <i>Rumors</i> (you learn which faction), <i>Named</i> (you learn a name). A plot can strike only after a season at Named and with strength 6 or more (under Standard balance; the start screen says what the other packages change). When it strikes it rolls one die plus its strength, and must beat your defense. Watch a suspect to see whether he is in it; turn an informer to learn its size; imprison a named plotter to take him out of it; keep the guard paid.</p>
    <h3>Rivals</h3>
    <p><b>Enemies</b> are made by wounds and want you dead. They carry scars, remember what you did, and can rise to Nemesis. <b>Political rivals</b> are made by ambition and want your place. A Pretender can depose you without a blow.</p>
    <h3>Words used in the game</h3>
    <dl class="gloss">${t("power", "Faction power")}${t("mood", "Mood")}${t("agenda", "Agenda")}${t("opinion", "Opinion")}${t("defense", "Your defense")}${t("influence", "Influence")}${t("government", "Government")}${t("carthage", "The Carthage clock")}${t("rank", "Enemy ranks")}${t("political", "Political rivals")}${t("reach", "Reach")}</dl>
    <h3>Real and invented</h3>
    <p>Most of the cast are real people, named by Diodorus, Plutarch and others; their sheets quote the passages. A few are invented where the sources name no one, and are marked so. Traits, opinions and every number in the rules are invention.</p>
    <p><button type="button" id="guide-again">Show the season guide again</button></p>
  </article>`;
}

// ---------- Clicks (registered once by the click layer, ui/app/clicks.ts) ----------
export const helpHandlers: Handlers = {
  click: {
    "#guide-done": (_, c) => { setGuideDone(true); c.render(); },
    "#guide-again": (_, c) => { setGuideDone(false); ui.view = "play"; ui.tab = "season"; c.render(); window.scrollTo({ top: 0 }); },
  },
};
