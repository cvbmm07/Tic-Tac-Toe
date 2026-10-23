import {
  CENTER_CELL,
  CELL_COUNT,
  CORNER_CELLS,
  GAME_MODE,
  WINNING_LINES,
} from "./game.constants.js";

export { WINNING_LINES } from "./game.constants.js";

export function createGame(mode = GAME_MODE.TWO_PLAYER) {
  return {
    board: Array(CELL_COUNT).fill(null),
    currentPlayer: "X",
    mode,
    status: "inProgress",
    winner: null,
    winningCells: [],
    moves: [],
  };
}

export function getOutcome(board) {
  for (const line of WINNING_LINES) {
    const [first, second, third] = line;
    if (board[first] && board[first] === board[second] && board[first] === board[third]) {
      return { status: "won", winner: board[first], winningCells: line };
    }
  }

  if (board.every(Boolean)) {
    return { status: "draw", winner: null, winningCells: [] };
  }

  return { status: "inProgress", winner: null, winningCells: [] };
}

export function makeMove(game, cell, player = game.currentPlayer) {
  if (!Number.isInteger(cell) || cell < 0 || cell >= CELL_COUNT) {
    throw new RangeError(`Move must target a cell from 0 to ${CELL_COUNT - 1}.`);
  }
  if (game.status !== "inProgress") {
    throw new Error("Cannot move after the game is complete.");
  }
  if (player !== game.currentPlayer || (player !== "X" && player !== "O")) {
    throw new Error(`It is ${game.currentPlayer}'s turn.`);
  }
  if (game.board[cell] !== null) {
    throw new Error("That cell is already occupied.");
  }

  const board = [...game.board];
  board[cell] = player;
  const outcome = getOutcome(board);

  return {
    ...game,
    board,
    currentPlayer: outcome.status === "inProgress" ? (player === "X" ? "O" : "X") : player,
    ...outcome,
    moves: [...game.moves, { player, cell }],
  };
}

export function updateScoreboard(scoreboard, previousGame, nextGame) {
  if (previousGame.status !== "inProgress" || nextGame.status === "inProgress") {
    return scoreboard;
  }

  if (nextGame.status === "draw") {
    return { ...scoreboard, draws: scoreboard.draws + 1 };
  }

  return { ...scoreboard, [nextGame.winner]: scoreboard[nextGame.winner] + 1 };
}

function canWinAt(board, player, cell) {
  if (board[cell] !== null) return false;
  const candidate = [...board];
  candidate[cell] = player;
  return getOutcome(candidate).winner === player;
}

export function getComputerMove(board) {
  for (let cell = 0; cell < CELL_COUNT; cell += 1) {
    if (canWinAt(board, "O", cell)) return cell;
  }
  for (let cell = 0; cell < CELL_COUNT; cell += 1) {
    if (canWinAt(board, "X", cell)) return cell;
  }
  if (board[CENTER_CELL] === null) return CENTER_CELL;
  for (const cell of CORNER_CELLS) {
    if (board[cell] === null) return cell;
  }
  return board.findIndex((cell) => cell === null);
}

export function undoGame(game, mode = game.mode) {
  if (game.status !== "inProgress" || game.moves.length === 0) return game;
  const removeCount = mode === GAME_MODE.COMPUTER && game.moves.length > 1 ? 2 : 1;
  const moves = game.moves.slice(0, Math.max(0, game.moves.length - removeCount));
  const board = Array(CELL_COUNT).fill(null);
  for (const move of moves) board[move.cell] = move.player;

  return {
    ...game,
    board,
    currentPlayer: moves.length === 0 ? "X" : moves.at(-1).player === "X" ? "O" : "X",
    status: "inProgress",
    winner: null,
    winningCells: [],
    moves,
  };
}
