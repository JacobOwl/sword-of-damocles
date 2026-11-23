// Writes the Workshop copy of the game for bet B5 (switch "dinners"): ui/dist/dinners.html, the built game with a small
// script that chooses "Set it up yourself" and ticks Dinners as the stage. Run `npm run build` first. Safe to rerun.
//   node scripts/workshop-dinners.ts
import { readFileSync, writeFileSync } from "node:fs";

const page = readFileSync("ui/dist/index.html", "utf8");
if (page.split("</body>").length !== 2) throw new Error("expected one </body> in ui/dist/index.html");
const inject = '<script>\n// Workshop copy: the "Dinners as the stage" switch starts ticked (bet B5). Everything else is the normal game.\n(function () {\n  var done = false;\n  function tick() {\n    if (done) return;\n    var box = document.querySelector(\'input.switch[value="dinners"]\');\n    if (!box) return;\n    done = true; box.checked = true;\n    var custom = document.querySelector(\'input[name="setup"][value="custom"]\');\n    if (custom) { custom.checked = true; custom.dispatchEvent(new Event("change", { bubbles: true })); }\n    var d = box.closest("details"); if (d) d.open = true;\n    var note = document.createElement("p");\n    note.className = "small"; note.style.cssText = "border-left:3px solid currentColor;padding-left:8px";\n    note.textContent = "Workshop copy: “Set it up yourself” is chosen, with Dinners as the stage ticked under the rule switches. Give a dinner is in your Court actions. Tick other switches too if you like.";\n    var b = document.querySelector(".begin"); if (b) b.insertBefore(note, b.firstChild);\n  }\n  new MutationObserver(tick).observe(document.documentElement, { childList: true, subtree: true });\n  document.addEventListener("DOMContentLoaded", tick);\n})();\n</script>';
writeFileSync("ui/dist/dinners.html", page.replace("</body>", `${inject}\n</body>`));
console.log("Wrote ui/dist/dinners.html.");
