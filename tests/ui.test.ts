// The screens are plain functions from game state to HTML, so they can be checked headless:
// every sheet, the court and the chronicle render for finished bot games, with no code ids or broken values shown.
import { test } from "node:test";
import assert from "node:assert/strict";
import { DATA, runBotGame } from "../src/core/index.ts";
import { ui, linkNames, pr } from "../ui/text.ts";
import { sheet, court } from "../ui/people.ts";
import { chronicleBook, seasonFeed } from "../ui/story.ts";

const ids = DATA.people.map((p) => p.id as string).filter((id) => /[A-Z]/.test(id));
const visibleText = (html: string) => html.replace(/<[^>]*>/g, " ");

function checkShown(html: string, where: string) {
  const text = visibleText(html);
  for (const id of ids) assert.ok(!text.includes(id), `${where}: code id ${id} shown`);
  assert.ok(!/\bundefined\b|\bNaN\b|\[object/.test(text), `${where}: broken value in ${text.slice(0, 200)}`);
}

test("every screen renders for 20 finished games without ids or broken values", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const s = runBotGame(seed);
    ui.s = s;
    for (const id of Object.keys(s.people)) checkShown(sheet(s, id), `seed ${seed} sheet ${id}`);
    checkShown(court(s), `seed ${seed} court`);
    checkShown(chronicleBook(s), `seed ${seed} chronicle`);
    for (let i = 0; i <= s.season; i++) { const f = seasonFeed(s, i); checkShown(f.groups + f.shifts, `seed ${seed} season ${i}`); }
  }
});

test("names in log sentences become links, longest name first", () => {
  ui.s = runBotGame(1);
  const html = linkNames("The brother of Demarchus mourns Demarchus.");
  assert.match(html, /data-person="demarchusBrother">The brother of Demarchus</);
  assert.match(html, /data-person="demarchus">Demarchus</);
  assert.equal(linkNames("<b>"), "&lt;b&gt;");
});

test("women are found from their relatives' words", () => {
  assert.equal(pr("theste").he, "she");
  assert.equal(pr("aristomache").his, "her");
  assert.equal(pr("polyxenus").he, "he");
  assert.equal(pr("leptines").him, "him");
});
