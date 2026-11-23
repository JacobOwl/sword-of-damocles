// The browser game starts here. The shell is in ui/app/, the screens in ui/views/ (docs/architecture.md).
import { installTips } from "./views/help.ts";
import { splash } from "./app/shell.ts";

installTips();
splash();
