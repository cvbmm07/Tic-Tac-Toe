import { formatCellPosition } from "../game.constants.js";

function MoveHistory({ moves }) {
  return (
    <section className="side-card history-card" aria-labelledby="history-title">
      <div className="card-heading">
        <span className="section-label" id="history-title">MOVE HISTORY</span>
        <span className="history-count">{String(moves.length).padStart(2, "0")} MOVES</span>
      </div>
      {moves.length === 0 ? (
        <div className="empty-history">
          <span className="empty-dash" />
          <p>Your first move is waiting.</p>
        </div>
      ) : (
        <div className="history-table-wrap">
          <table className="history-table">
            <thead><tr><th scope="col">MOVE</th><th scope="col">PLAYER</th><th scope="col">POSITION</th></tr></thead>
            <tbody>
              {moves.map((move, index) => (
                <tr key={`${move.player}-${move.cell}-${index}`}>
                  <td>{String(index + 1).padStart(2, "0")}</td>
                  <td><span className={`history-player player-${move.player.toLowerCase()}`}>{move.player}</span></td>
                  <td>{formatCellPosition(move.cell)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default MoveHistory;
