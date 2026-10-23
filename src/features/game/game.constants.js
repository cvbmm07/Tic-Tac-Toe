export const GAME_MODE = Object.freeze({
  COMPUTER: "computer",
  TWO_PLAYER: "twoPlayer",
});

export const BOARD_SIZE = 3;
export const CELL_COUNT = BOARD_SIZE * BOARD_SIZE;
export const CENTER_CELL = Math.floor(CELL_COUNT / 2);
export const COMPUTER_THINK_DELAY_MS = 420;
export const CORNER_CELLS = Object.freeze([0, 2, 6, 8]);
export const SCORE_STORAGE_KEY = "tic-tac-toe-scoreboard";

export const EMPTY_SCOREBOARD = Object.freeze({
  X: 0,
  O: 0,
  draws: 0,
});

export const WINNING_LINES = Object.freeze([
  Object.freeze([0, 1, 2]),
  Object.freeze([3, 4, 5]),
  Object.freeze([6, 7, 8]),
  Object.freeze([0, 3, 6]),
  Object.freeze([1, 4, 7]),
  Object.freeze([2, 5, 8]),
  Object.freeze([0, 4, 8]),
  Object.freeze([2, 4, 6]),
]);

export function formatCellPosition(cell) {
  return `Row ${Math.floor(cell / BOARD_SIZE) + 1}, Column ${(cell % BOARD_SIZE) + 1}`;
}
