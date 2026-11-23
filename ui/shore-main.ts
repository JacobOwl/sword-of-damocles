// The Workshop page for bet B6, "The other shore": the full game with the switch "Carthage's chronicle" ticked on the
// start screen, and a view that tells the decade from Carthage's side. Built to its own page
// (npm run build -- --page shore) and published on the Workshop as shore.html, never at the test link.
import "./styles/shore.css";
import { installTips } from "./views/help.ts";
import { addView } from "./app/extras.ts";
import { shoreView, shoreHandlers, shoreOnEnding, shoreWhen } from "./views/shore.ts";
import { splash } from "./app/shell.ts";

(globalThis as { __WORKSHOP?: string[] }).__WORKSHOP = ["carthageChronicle"]; // read by the start screen (ui/views/start.ts)
addView({ id: "shore", label: "Carthage's chronicle", render: shoreView, handlers: shoreHandlers, onEnding: shoreOnEnding, when: shoreWhen });
installTips();
splash();
