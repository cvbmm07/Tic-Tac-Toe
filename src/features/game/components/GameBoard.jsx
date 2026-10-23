import { formatCellPosition } from "../game.constants.js";

function GameBoard({ game, isComputerThinking, statusMessage, onMove }) {
  const gameComplete = game.status !== "inProgress";

  return (
    <div className="play-panel">
      <div className="panel-topline">
        <span className="section-label">THE BOARD</span>
        <span className="round-indicator">
          ROUND <b>{String(Math.floor(game.moves.length / 2) + 1).padStart(2, "0")}</b>
        </span>
      </div>

      <div className={`turn-banner ${gameComplete ? "is-complete" : ""}`} aria-live="polite">
        <span className={`turn-symbol ${game.winner ? `symbol-${game.winner.toLowerCase()}` : ""}`}>
          {game.status === "draw" ? "↔" : game.winner || game.currentPlayer}
        </span>
        <span className="turn-copy">
          <strong>{statusMessage}</strong>
          <small>
            {gameComplete
              ? "Start a new game whenever you're ready."
              : game.mode === "computer"
                ? "You play as X · Computer plays as O"
                : "Two players · One board"}
          </small>
        </span>
        <span className={`live-pill ${gameComplete ? "live-pill-complete" : ""}`}>
          <i /> {gameComplete ? "COMPLETE" : "IN PLAY"}
        </span>
      </div>

      <div className="board" role="group" aria-label="Tic Tac Toe board">
        {game.board.map((cell, index) => {
          const winningCell = game.winningCells.includes(index);
          return (
            <button
              className={`cell ${cell ? `cell-${cell.toLowerCase()}` : ""} ${winningCell ? "cell-winning" : ""}`}
              key={index}
              type="button"
              aria-label={`${formatCellPosition(index)}${cell ? `, ${cell}` : ", empty"}`}
              aria-pressed={Boolean(cell)}
              disabled={Boolean(cell) || gameComplete || isComputerThinking}
              onClick={() => onMove(index)}
            >
              {cell && <span>{cell === "X" ? "×" : "○"}</span>}
              {!cell && <span className="cell-number">{String(index + 1).padStart(2, "0")}</span>}
            </button>
          );
        })}
      </div>

      <div className="board-footer">
        <span><kbd>1—9</kbd> POSITION</span>
        <span>BEST OF ONE <b>✳</b></span>
      </div>
    </div>
  );
}

export default GameBoard;
