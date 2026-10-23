import test from "node:test";
import assert from "node:assert/strict";
import { getCellIndexFromShortcut } from "./keyboard.js";

test("maps valid board shortcuts to zero-based cell indexes", () => {
  assert.equal(getCellIndexFromShortcut("1"), 0);
  assert.equal(getCellIndexFromShortcut("9"), 8);
});

test("ignores non-digit and out-of-board keyboard shortcuts", () => {
  assert.equal(getCellIndexFromShortcut("0"), null);
  assert.equal(getCellIndexFromShortcut("a"), null);
  assert.equal(getCellIndexFromShortcut("10"), null);
});
