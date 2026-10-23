import { CELL_COUNT } from "./game.constants.js";

const NON_GAME_INTERACTIVE_TARGETS = [
  "input",
  "textarea",
  "select",
  "a",
  "button:not(.cell)",
  "[contenteditable='true']",
  "[role='button']",
].join(", ");

export function getCellIndexFromShortcut(key) {
  if (!/^\d$/.test(key)) return null;
  const value = Number(key);
  if (value < 1 || value > CELL_COUNT) return null;
  const index = value - 1;
  return index < CELL_COUNT ? index : null;
}

export function canUseCellShortcut(target) {
  if (!target || typeof target.closest !== "function") return true;
  return !target.closest(NON_GAME_INTERACTIVE_TARGETS);
}
