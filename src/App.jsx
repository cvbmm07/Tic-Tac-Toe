import "./features/game/game.css";
import GameActions from "./features/game/components/GameActions.jsx";
import GameBoard from "./features/game/components/GameBoard.jsx";
import GameModeSelector from "./features/game/components/GameModeSelector.jsx";
import MoveHistory from "./features/game/components/MoveHistory.jsx";
import Scoreboard from "./features/game/components/Scoreboard.jsx";
import { useGameController } from "./features/game/useGameController.js";

function App() {
  const {
    game,
    mode,
    scoreboard,
    isComputerThinking,
    gameComplete,
    statusMessage,
    onMove,
    onModeChange,
    onUndo,
    onNewGame,
    onResetScoreboard,
  } = useGameController();

  return (
    <main className="app-shell">
      <div className="app-wrap">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="Crossplay home">
            <span className="brand-mark"><span>×</span><span>○</span></span>
            <span>CROSSPLAY<span className="brand-dot">.</span></span>
          </a>
          <div className="topbar-right">
            <span className="online-indicator"><i /> LOCAL GAME</span>
            <span className="topbar-divider" />
            <span className="edition-label">A LITTLE FRIENDLY COMPETITION</span>
          </div>
        </header>

        <section className="intro" id="top">
          <div>
            <p className="eyebrow"><span>01</span> THE CLASSIC, REIMAGINED</p>
            <h1>Make your<br /><em>next move.</em></h1>
          </div>
          <p className="intro-copy">
            Three in a row. A little strategy.<br />
            And the glory of a very small victory.
          </p>
        </section>

        <section className="game-layout" aria-label="Tic Tac Toe game">
          <GameBoard
            game={game}
            isComputerThinking={isComputerThinking}
            statusMessage={statusMessage}
            onMove={onMove}
          />

          <aside className="sidebar">
            <GameModeSelector mode={mode} onModeChange={onModeChange} />
            <Scoreboard scoreboard={scoreboard} onReset={onResetScoreboard} />
            <MoveHistory moves={game.moves} />
            <GameActions
              canUndo={!gameComplete && game.moves.length > 0}
              onUndo={onUndo}
              onNewGame={onNewGame}
            />
            {gameComplete && <p className="undo-note">Undo is unavailable after a completed round.</p>}
          </aside>
        </section>

        <footer className="page-footer">
          <span>NO CLOCK. NO PRESSURE. JUST ONE MORE GAME.</span>
          <span>MADE FOR THE LOVE OF THE GAME <b>✳</b></span>
        </footer>
      </div>
    </main>
  );
}

export default App;
