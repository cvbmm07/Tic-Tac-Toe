import Icon from "../../../components/icons/Icon.jsx";

function Scoreboard({ scoreboard, onReset }) {
  return (
    <section className="side-card score-card" aria-labelledby="scoreboard-title">
      <div className="card-heading">
        <span className="section-label" id="scoreboard-title">THE SCOREBOARD</span>
        <span className="score-caption">SESSION TOTALS</span>
      </div>
      <div className="scores">
        <div className="score-item">
          <span className="score-mark score-x">×</span>
          <span className="score-label">PLAYER X</span>
          <strong>{String(scoreboard.X).padStart(2, "0")}</strong>
        </div>
        <div className="score-item">
          <span className="score-mark score-o">○</span>
          <span className="score-label">PLAYER O</span>
          <strong>{String(scoreboard.O).padStart(2, "0")}</strong>
        </div>
        <div className="score-item">
          <span className="score-mark">↔</span>
          <span className="score-label">DRAWS</span>
          <strong>{String(scoreboard.draws).padStart(2, "0")}</strong>
        </div>
      </div>
      <button className="text-button reset-score" type="button" onClick={onReset}>
        <Icon name="reset" size={13} /> RESET SCOREBOARD
      </button>
    </section>
  );
}

export default Scoreboard;
