// The Workshop page for bet B4, "Great works": the full game with the switch "Great works" ticked on the start screen.
// It is built to its own page (npm run build -- --page works) and published on the Workshop, never at the test link.
import { installTips } from "./views/help.ts";
import { splash } from "./app/shell.ts";

(globalThis as { __WORKSHOP?: string[] }).__WORKSHOP = ["greatWorks"]; // read by the start screen (ui/views/start.ts)
installTips();
splash();
