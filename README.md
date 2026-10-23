# Crossplay — Tic Tac Toe

A browser-based Tic Tac Toe game built with React and Vite. Play against a friend or a simple computer opponent, review the move history, undo moves, and keep session scores.

## Tech stack

- React 19
- Vite
- JavaScript (ES modules)
- Vitest and Testing Library for UI interaction tests
- Node.js built-in test runner for game-logic tests

## Features

- Responsive 3 × 3 board with clear turn, win, and draw states
- Two-player mode and computer mode (human is X, computer is O)
- Computer move priority: win, block, center, corner, then any open cell
- Move history with move number, player, and row/column
- Mode-aware undo: one move in two-player mode; the human/computer pair in computer mode
- Winning-cell highlight and completed-game move lock
- Scoreboard for X wins, O wins, and draws
- Start a fresh game without changing the scores; reset the scoreboard separately
- Accessible board buttons, keyboard focus styling, and 1–9 cell shortcuts (ignored in text fields and other controls)

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:3000`).

## Tests and build

```sh
npm test
npm run lint
npm run build
```

`npm test` runs both the pure game-rule tests and the rendered UI interaction tests. `npm run test:logic` runs only the Node.js game-rule tests.

## Game rules and state

Game rules live in `src/features/game/game.js`, while `src/features/game/useGameController.js` owns React state, persistence, keyboard input, and the delayed computer turn. The app is composed from feature components in `src/features/game/components/`; shared icons live in `src/components/icons/`. Shared design tokens are in `src/styles/tokens.css`, and game presentation styles are in `src/features/game/game.css`.

The scoreboard is stored in browser `localStorage` so it survives page reloads in the same browser. The current board and move history are in React state and start fresh after a reload.

This submission follows the assignment's final note, “Do it in React backend not mandatory”: it is a React-only client-side implementation, with no .NET service or REST API. Consequently, game state is owned by the browser rather than a backend. The React game logic is the source of truth for move validation, outcomes, move history, and undo.

### Undo and score policy

Undo is disabled after a win or draw (Clarification Option A). This keeps a recorded result final. In two-player mode, undo removes one move. In computer mode, once the computer replies, undo removes its move and the preceding human move together.

### API contract

There is no API in this version. The original suggested `/api/games` and `/api/scoreboard` endpoints are not implemented because a backend was explicitly noted as optional.

## Design decisions and assumptions

- The computer always plays O, and the human always plays X.
- Switching modes starts a fresh board but does not reset scores.
- Scores persist locally between reloads; resetting scores affects only the current browser's stored scoreboard.
- Computer replies are delayed briefly so the move is visible as a separate turn.
- Computer move rules use the specified priority list, rather than a full minimax strategy.
- A reload starts a new game while preserving scoreboard totals.

## AI-assisted development notes

AI assistance was used to translate the acceptance criteria into a focused implementation: reusable game rules, explicit game modes, history-aware undo, a separate scoreboard lifecycle, a responsive interface, and unit tests. Generated code was reviewed against the edge cases in the assignment, particularly move validation, winner/draw locking, computer reply timing, and preventing duplicate score updates.

## Known limitations and future improvements

- No backend, multi-device synchronization, or server-side session state.
- The current game board is not persisted across refreshes.
- The computer follows the requested tactical priority but does not guarantee optimal play.
- Google Fonts are loaded from the network; system serif/sans-serif fallbacks are provided.
- A future backend could own game sessions and scores through the REST contract outlined in the assignment.
