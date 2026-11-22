// Content validation: every record is tagged history or invention; history needs a source and a research card.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { DATA } from "../src/core/index.ts";
import { IMPL } from "../src/core/actions.ts";

const files = readdirSync("data").filter((f) => f.endsWith(".json"));

function records(obj: any): any[] {
  if (Array.isArray(obj)) return obj.filter((x) => x && typeof x === "object" && "id" in x);
  return Object.values(obj).flatMap((v) => (typeof v === "object" && v ? records(v) : []));
}

test("every data record is tagged history or invention", () => {
  for (const f of files) {
    const json = JSON.parse(readFileSync(`data/${f}`, "utf8"));
    const rs = records(json);
    if (!rs.length) assert.ok(["history", "invention"].includes(json.kind), `${f} has no records and no kind tag`);
    for (const r of rs) {
      if (f === "rivals.json" && "rank" in r) continue;
      assert.ok(["history", "invention"].includes(r.kind), `${f}: ${r.id} lacks kind: history or kind: invention`);
      if (r.kind === "history") {
        assert.ok(r.source, `${f}: ${r.id} is history but has no source`);
        assert.ok(r.card && existsSync(r.card), `${f}: ${r.id} needs a research card in docs/research/ (got ${r.card})`);
        const card = readFileSync(r.card, "utf8");
        const name = String(r.name ?? "").replace(/^the /, "").split(" ")[0].replace(/'s$/, "");
        assert.ok(card.includes(name), `${f}: ${r.id}'s card does not mention ${name}`);
      }
    }
  }
});

test("every action in the menu has rules, and every trait used exists", () => {
  for (const a of DATA.actions) if (!a.aiOnly) assert.ok(IMPL[a.id], `no rules for ${a.id}`);
  const traits = new Set(DATA.traits.map((t) => t.id));
  for (const p of DATA.people) for (const t of p.traits ?? []) assert.ok(traits.has(t), `${p.id}: unknown trait ${t}`);
  const factions = new Set([...DATA.factions.map((f) => f.id), "ruler"]);
  for (const p of DATA.people) assert.ok(factions.has(p.faction), `${p.id}: unknown faction ${p.faction}`);
});
