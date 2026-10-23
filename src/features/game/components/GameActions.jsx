import Icon from "../../../components/icons/Icon.jsx";

function GameActions({ canUndo, onUndo, onNewGame }) {
  return (
    <div className="game-actions">
      <button className="action-button undo-button" type="button" disabled={!canUndo} onClick={onUndo}>
        <Icon name="undo" /> UNDO LAST MOVE
      </button>
      <button className="action-button new-game-button" type="button" onClick={onNewGame}>
        <Icon name="reset" /> NEW GAME
      </button>
    </div>
  );
}

export default GameActions;
