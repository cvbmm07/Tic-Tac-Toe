import { useCallback, useEffect, useState } from "react";
import {
  COMPUTER_THINK_DELAY_MS,
  EMPTY_SCOREBOARD,
  GAME_MODE,
  SCORE_STORAGE_KEY,
} from "./game.constants.js";
import {
  createGame,
  getComputerMove,
  makeMove,
  updateScoreboard,
  undoGame,
} from "./game.js";
import { canUseCellShortcut, getCellIndexFromShortcut } from "./keyboard.js";

function readScoreboard() {
  try {
    const stored = window.localStorage.getItem(SCORE_STORAGE_KEY);
    if (!stored) return { ...EMPTY_SCOREBOARD };
    const parsed = JSON.parse(stored);
    return {
      X: Number.isFinite(parsed.X) ? parsed.X : 0,
      O: Number.isFinite(parsed.O) ? parsed.O : 0,
      draws: Number.isFinite(parsed.draws) ? parsed.draws : 0,
    };
  } catch (error) {
    console.error("Unable to read the scoreboard from browser storage.", error);
    return { ...EMPTY_SCOREBOARD };
  }
}

export function useGameController() {
  const [game, setGame] = useState(() => createGame(GAME_MODE.COMPUTER));
  const [scoreboard, setScoreboard] = useState(readScoreboard);
  const mode = game.mode;
  const isComputerThinking = mode === GAME_MODE.COMPUTER
    && game.status === "inProgress"
    && game.currentPlayer === "O"
    && game.moves.at(-1)?.player === "X";

  const handleMove = useCallback((cell) => {
    if (
      game.status !== "inProgress" ||
      game.board[cell] !== null ||
      isComputerThinking ||
      (mode === GAME_MODE.COMPUTER && game.currentPlayer !== "X")
    ) {
      return;
    }

    const nextGame = makeMove(game, cell);
    setGame(nextGame);
    if (nextGame.status !== "inProgress") {
      setScoreboard((current) => updateScoreboard(current, game, nextGame));
    }
  }, [game, isComputerThinking, mode]);

  const handleModeChange = useCallback((nextMode) => {
    if (nextMode !== mode) setGame(createGame(nextMode));
  }, [mode]);

  const handleUndo = useCallback(() => {
    setGame((currentGame) => undoGame(currentGame));
  }, []);

  const handleNewGame = useCallback(() => {
    setGame(createGame(mode));
  }, [mode]);

  const handleResetScoreboard = useCallback(() => {
    setScoreboard({ ...EMPTY_SCOREBOARD });
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(scoreboard));
    } catch (error) {
      console.error("Unable to save the scoreboard to browser storage.", error);
    }
  }, [scoreboard]);

  useEffect(() => {
    if (
      mode !== GAME_MODE.COMPUTER ||
      game.status !== "inProgress" ||
      game.currentPlayer !== "O" ||
      game.moves.at(-1)?.player !== "X"
    ) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      const cell = getComputerMove(game.board);
      if (cell < 0) return;

      const nextGame = makeMove(game, cell, "O");
      setGame(nextGame);
      if (nextGame.status !== "inProgress") {
        setScoreboard((current) => updateScoreboard(current, game, nextGame));
      }
    }, COMPUTER_THINK_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [game, mode]);

  useEffect(() => {
    function handleNumberKey(event) {
      const cell = getCellIndexFromShortcut(event.key);
      if (
        cell === null ||
        event.repeat ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        !canUseCellShortcut(event.target)
      ) {
        return;
      }

      if (game.board[cell] === null) handleMove(cell);
    }

    window.addEventListener("keydown", handleNumberKey);
    return () => window.removeEventListener("keydown", handleNumberKey);
  }, [game.board, handleMove]);

  const gameComplete = game.status !== "inProgress";
  const statusMessage = game.status === "won"
    ? `${game.winner} takes the round!`
    : game.status === "draw"
      ? "It's a draw. Well played."
      : isComputerThinking
        ? "Computer is thinking..."
        : mode === GAME_MODE.COMPUTER && game.currentPlayer === "O"
          ? "Computer's turn"
          : `${game.currentPlayer}'s turn`;

  return {
    game,
    mode,
    scoreboard,
    isComputerThinking,
    gameComplete,
    statusMessage,
    onMove: handleMove,
    onModeChange: handleModeChange,
    onUndo: handleUndo,
    onNewGame: handleNewGame,
    onResetScoreboard: handleResetScoreboard,
  };
}
