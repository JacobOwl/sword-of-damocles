// The Workshop page for bet B7, "Fallen, not finished" (exile and return): the full game with the switch ticked on
// the start screen, and "Begin fallen" offered unticked beside it. Built to its own page (npm run build -- --page exile)
// and published on the Workshop, never at the test link.
import { installTips } from "./views/help.ts";
import { splash } from "./app/shell.ts";

(globalThis as { __WORKSHOP?: string[] }).__WORKSHOP = ["exile"]; // read by the start screen (ui/views/start.ts)
(globalThis as { __WORKSHOP_OFFER?: string[] }).__WORKSHOP_OFFER = ["exileStart"];
installTips();
splash();
