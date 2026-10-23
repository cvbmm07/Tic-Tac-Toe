import { GAME_MODE } from "../game.constants.js";

function GameModeSelector({ mode, onModeChange }) {
  return (
    <section className="side-card mode-card">
      <div className="card-heading">
        <span className="section-label">CHOOSE YOUR GAME</span>
        <span className="step-count">01 / 03</span>
      </div>
      <div className="mode-options" role="group" aria-label="Game mode">
        <button
          className={`mode-option ${mode === GAME_MODE.COMPUTER ? "mode-selected" : ""}`}
          type="button"
          aria-pressed={mode === GAME_MODE.COMPUTER}
          onClick={() => onModeChange(GAME_MODE.COMPUTER)}
        >
          <span className="mode-icon computer-icon">✳</span>
          <span><strong>Vs. computer</strong><small>Just you & the machine</small></span>
          <span className="mode-radio" />
        </button>
        <button
          className={`mode-option ${mode === GAME_MODE.TWO_PLAYER ? "mode-selected" : ""}`}
          type="button"
          aria-pressed={mode === GAME_MODE.TWO_PLAYER}
          onClick={() => onModeChange(GAME_MODE.TWO_PLAYER)}
        >
          <span className="mode-icon players-icon">Ⅱ</span>
          <span><strong>Two players</strong><small>Pass the screen around</small></span>
          <span className="mode-radio" />
        </button>
      </div>
    </section>
  );
}

export default GameModeSelector;
