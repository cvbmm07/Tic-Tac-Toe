import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App.jsx";

describe("Tic Tac Toe interface", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders a labeled board and disables undo before the first move", () => {
    render(<App />);

    expect(screen.getByRole("group", { name: "Tic Tac Toe board" })).toBeTruthy();
    expect(screen.getAllByRole("button", { name: /Row \d, Column \d, empty/ })).toHaveLength(9);
    expect(screen.getByRole("button", { name: "UNDO LAST MOVE" }).disabled).toBe(true);
  });

  it("plays two-player moves, displays history, and undoes one move", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Two players/ }));
    fireEvent.keyDown(document.body, { key: "1" });
    fireEvent.keyDown(document.body, { key: "2" });

    expect(screen.getByRole("button", { name: "Row 1, Column 1, X" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Row 1, Column 2, O" })).toBeTruthy();
    expect(screen.getByRole("row", { name: /01 X Row 1, Column 1/ })).toBeTruthy();
    expect(screen.getByRole("row", { name: /02 O Row 1, Column 2/ })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "UNDO LAST MOVE" }));
    expect(screen.getByRole("button", { name: "Row 1, Column 2, empty" })).toBeTruthy();
    expect(screen.getByText("O's turn")).toBeTruthy();
  });

  it("does not trigger a number shortcut while a non-board control has focus", async () => {
    const user = userEvent.setup();
    render(<App />);
    const newGameButton = screen.getByRole("button", { name: "NEW GAME" });
    await user.click(newGameButton);
    fireEvent.keyDown(newGameButton, { key: "3" });

    expect(screen.getByRole("button", { name: "Row 1, Column 3, empty" })).toBeTruthy();
    expect(screen.getByText("Your first move is waiting.")).toBeTruthy();
  });
  it("automatically replies in computer mode and undo removes the move pair", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Row 1, Column 1, empty" }));
    expect(screen.getByText("Computer is thinking...")).toBeTruthy();

    expect(await screen.findByRole("button", { name: "Row 2, Column 2, O" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "UNDO LAST MOVE" }));
    expect(screen.getByRole("button", { name: "Row 1, Column 1, empty" })).toBeTruthy();
    expect(screen.getByText("Your first move is waiting.")).toBeTruthy();
  });

  it("updates the scoreboard once when a player wins", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /Two players/ }));

    for (const cell of [0, 3, 1, 4, 2]) {
      const label = `Row ${Math.floor(cell / 3) + 1}, Column ${(cell % 3) + 1}, empty`;
      await user.click(screen.getByRole("button", { name: label }));
    }

    expect(screen.getByText("X takes the round!")).toBeTruthy();
    const scoreboard = screen.getByRole("region", { name: "THE SCOREBOARD" });
    expect(within(scoreboard).getByText("01")).toBeTruthy();
    expect(screen.getByRole("button", { name: "UNDO LAST MOVE" }).disabled).toBe(true);
  });
});
