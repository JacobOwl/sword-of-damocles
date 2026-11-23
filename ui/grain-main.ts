// The Workshop page for bet B3, "Grain and the sea": the full game with the switch "convoys" ticked for you on the
// start screen, plus a view that shows every convoy at sea. Built to its own page (npm run build -- --page grain) and
// published on the Workshop, never at the test link.
import "./styles/grain.css";
import { installTips } from "./views/help.ts";
import { addView } from "./app/extras.ts";
import { grainView } from "./views/grain.ts";
import { splash } from "./app/shell.ts";
import { switchById } from "../src/core/index.ts";

addView({ id: "grain", label: "Grain and the sea", render: grainView });
installTips();

// Tick the switch on the start screen whenever it is drawn: beside the recommended setup, and in the custom list.
function tick() {
  const app = document.getElementById("app");
  if (!app) return;
  const custom = app.querySelector<HTMLInputElement>('input.switch[value="convoys"]');
  if (custom && !custom.dataset.grain) { custom.checked = true; custom.dataset.grain = "1"; }
  const card = app.querySelector<HTMLElement>(".setups label.setup");
  if (card && !app.querySelector('input.extra[value="convoys"]')) {
    const w = switchById("convoys")!;
    const box = document.createElement("div");
    box.className = "setup-extra";
    box.innerHTML = `<p class="small"><label><input type="checkbox" class="extra" value="convoys" checked> <span class="tag new">this page</span> <b>${w.name}.</b> ${w.summary}</label></p>`;
    card.after(box);
  }
}
new MutationObserver(tick).observe(document.getElementById("app")!, { childList: true });
splash();
tick();
