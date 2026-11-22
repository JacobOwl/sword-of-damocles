// All game content comes from data/. This file only loads it and gives it types.
import factionsJson from "../../data/factions.json" with { type: "json" };
import peopleJson from "../../data/people.json" with { type: "json" };
import officesJson from "../../data/offices.json" with { type: "json" };
import traitsJson from "../../data/traits.json" with { type: "json" };
import actionsJson from "../../data/actions.json" with { type: "json" };
import agendasJson from "../../data/agendas.json" with { type: "json" };
import lawsJson from "../../data/laws.json" with { type: "json" };
import placesJson from "../../data/places.json" with { type: "json" };
import warningsJson from "../../data/warnings.json" with { type: "json" };
import startJson from "../../data/start.json" with { type: "json" };
import rivalsJson from "../../data/rivals.json" with { type: "json" };

export interface TraitDef { id: string; name: string; actor?: Record<string, number>; target?: Record<string, number>; note?: string }
export interface ActionDef {
  id: string; area: string; name: string; cost: string; roll: string; success: string; failure?: string;
  ruler?: boolean; reach?: boolean; slots?: number; aiOnly?: boolean; scenario?: "citadel" | "island"; switch?: string;
}
export interface AgendaDef { id: string; name: string; owner: string; steps: string[]; completes: string; grantedBy?: string; wants?: string; againstRuler?: boolean }
export interface LawDef {
  id: string; name: string; for: string[]; against: string[]; income?: number; grain?: number;
  once?: { silver: number }; moods?: Record<string, number>; detail: string; repeatable?: boolean; servesCitizens?: boolean;
}
export interface PlaceDef {
  id: string; name: string; raid: boolean; march: boolean; walled: boolean; carthaginian?: boolean;
  marchMod?: number; reward?: { silver?: number; land?: number }; treaty?: boolean; exiles?: boolean; detail: string;
}
export interface OriginDef { id: string; name: string; madeBy: string; effect: string; hooks: Record<string, number> }
export interface RankDef { rank: number; title: string; plotBonus: number; effect: string }

export const DATA = {
  factions: ((factionsJson as any).factions ?? (factionsJson as any).records) as any[],
  people: ((peopleJson as any).people ?? (peopleJson as any).records) as any[],
  offices: officesJson.offices,
  traits: traitsJson.traits as unknown as TraitDef[],
  actions: actionsJson.actions as unknown as ActionDef[],
  areas: actionsJson.areas,
  agendas: agendasJson.agendas as unknown as AgendaDef[],
  laws: lawsJson.laws as unknown as LawDef[],
  places: placesJson.places as unknown as PlaceDef[],
  warnings: warningsJson,
  start: startJson,
  origins: rivalsJson.origins as unknown as OriginDef[],
  ranks: rivalsJson.ranks as RankDef[],
  politicalTypes: rivalsJson.politicalTypes,
  politicalRanks: rivalsJson.politicalRanks,
  politicalTypeByFaction: rivalsJson.politicalTypeByFaction as Record<string, string>,
  maxEnemies: rivalsJson.maxEnemies,
  maxPolitical: rivalsJson.maxPolitical,
};

export const traitById = (id: string) => DATA.traits.find((t) => t.id === id);
export const actionById = (id: string) => DATA.actions.find((a) => a.id === id);
export const agendaById = (id: string) => DATA.agendas.find((a) => a.id === id)!;
export const lawById = (id: string) => DATA.laws.find((l) => l.id === id);
export const placeById = (id: string) => DATA.places.find((p) => p.id === id);
export const originById = (id: string) => DATA.origins.find((o) => o.id === id);
export const rankTitle = (rank: number) => DATA.ranks.find((r) => r.rank === rank)?.title ?? "";
export const rankBonus = (rank: number) => DATA.ranks.find((r) => r.rank === rank)?.plotBonus ?? 0;
