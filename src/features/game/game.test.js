import test from "node:test";
import assert from "node:assert/strict";
import {
  createGame,
  getComputerMove,
  getOutcome,
  makeMove,
  updateScoreboard,
  undoGame,
} from "./game.js";

function play(game, cells) {
  return cells.reduce((current, cell) => makeMove(current, cell), game);
}

test("accepts a valid move and switches turns", () => {
  const next = makeMove(createGame(), 0);
  assert.equal(next.board[0], "X");
  assert.equal(next.currentPlayer, "O");
  assert.deepEqual(next.moves, [{ player: "X", cell: 0 }]);
});

test("rejects invalid, occupied, and out-of-turn moves", () => {
  const afterFirstMove = makeMove(createGame(), 0);
  assert.throws(() => makeMove(afterFirstMove, 0), /already occupied/);
  assert.throws(() => makeMove(afterFirstMove, 1, "X"), /turn/);
  assert.throws(() => makeMove(afterFirstMove, 9), /0 to 8/);
});

test("detects row, column, and diagonal wins with winning cells", () => {
  const row = play(createGame(), [0, 3, 1, 4, 2]);
  const column = play(createGame(), [0, 1, 3, 2, 6]);
  const diagonal = play(createGame(), [0, 1, 4, 2, 8]);
  assert.deepEqual([row.status, row.winner, row.winningCells], ["won", "X", [0, 1, 2]]);
  assert.deepEqual([column.status, column.winner, column.winningCells], ["won", "X", [0, 3, 6]]);
  assert.deepEqual([diagonal.status, diagonal.winner, diagonal.winningCells], ["won", "X", [0, 4, 8]]);
});

test("detects a draw after all cells are filled", () => {
  const game = play(createGame(), [0, 1, 2, 4, 3, 5, 7, 6, 8]);
  assert.equal(game.status, "draw");
  assert.equal(game.winner, null);
  assert.equal(game.currentPlayer, "X");
});

test("prevents moves after the game is complete and resets to X", () => {
  const won = play(createGame(), [0, 3, 1, 4, 2]);
  assert.throws(() => makeMove(won, 8), /game is complete/);
  const reset = createGame("computer");
  assert.equal(reset.status, "inProgress");
  assert.equal(reset.currentPlayer, "X");
  assert.equal(reset.moves.length, 0);
  assert.equal(reset.mode, "computer");
});

test("undo removes one move in two-player mode", () => {
  const game = play(createGame("twoPlayer"), [0, 4]);
  const undone = undoGame(game, "twoPlayer");
  assert.equal(undone.board[4], null);
  assert.equal(undone.currentPlayer, "O");
  assert.deepEqual(undone.moves, [{ player: "X", cell: 0 }]);
});

test("undo removes the human-computer move pair", () => {
  const game = play(createGame("computer"), [0, 4]);
  const undone = undoGame(game, "computer");
  assert.equal(undone.board.every((cell) => cell === null), true);
  assert.equal(undone.currentPlayer, "X");
  assert.equal(undone.moves.length, 0);
});

test("undo during the computer reply delay removes the prior computer-human pair", () => {
  const game = play(createGame("computer"), [0, 4, 1]);
  const undone = undoGame(game, "computer");
  assert.equal(undone.board[0], "X");
  assert.equal(undone.board[4], null);
  assert.equal(undone.board[1], null);
  assert.equal(undone.currentPlayer, "O");
  assert.deepEqual(undone.moves, [{ player: "X", cell: 0 }]);
});

test("does not undo completed games (score policy Option A)", () => {
  const won = play(createGame("twoPlayer"), [0, 3, 1, 4, 2]);
  assert.equal(undoGame(won, "twoPlayer"), won);
});

test("updates the scoreboard once for a newly completed game", () => {
  const initialScores = { X: 0, O: 0, draws: 0 };
  const inProgress = play(createGame(), [0, 3, 1, 4]);
  const won = makeMove(inProgress, 2);
  const updated = updateScoreboard(initialScores, inProgress, won);
  assert.deepEqual(updated, { X: 1, O: 0, draws: 0 });
  assert.equal(updateScoreboard(updated, won, won), updated);

  const beforeDraw = play(createGame(), [0, 1, 2, 4, 3, 5, 7, 6]);
  const draw = makeMove(beforeDraw, 8);
  assert.deepEqual(updateScoreboard(initialScores, beforeDraw, draw), { X: 0, O: 0, draws: 1 });
});

test("computer wins first, blocks next, then chooses center and corners", () => {
  assert.equal(getComputerMove(["O", "O", null, "X", "X", null, null, null, null]), 2);
  assert.equal(getComputerMove(["X", "X", null, "O", null, null, null, null, null]), 2);
  assert.equal(getComputerMove(["X", null, null, null, null, null, null, null, null]), 4);
  assert.equal(getComputerMove(["X", null, null, null, "O", null, null, null, null]), 2);
});

test("computer picks any remaining cell when center and corners are unavailable", () => {
  assert.equal(getComputerMove(["X", "O", "X", "O", "X", null, "O", "X", "O"]), 5);
  assert.equal(getComputerMove(Array(9).fill("X")), -1);
});

test("outcome is in progress on an unfinished board", () => {
  assert.deepEqual(getOutcome(["X", null, null, null, "O", null, null, null, null]), {
    status: "inProgress",
    winner: null,
    winningCells: [],
  });
});
