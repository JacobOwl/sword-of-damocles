// The Workshop page for bet B2, "Change the past": the full game, plus a view that goes back to any season.
// It is built to its own page (npm run build -- --page past) and published on the Workshop, never at the test link.
import "./styles/past.css";
import { installTips } from "./views/help.ts";
import { addView } from "./app/extras.ts";
import { pastView, pastHandlers, pastOnEnding } from "./views/past.ts";
import { splash } from "./app/shell.ts";

addView({ id: "past", label: "Change the past", render: pastView, handlers: pastHandlers, onEnding: pastOnEnding });
installTips();
splash();
