// Have You Tried Turning It Off? — make.fun entry
//
// Writes one funny line, spoken by a hopeless tech support agent to a
// desperate customer, to /output/entry.txt. The twist on the classic:
// the thing that gets turned off and on again is not the customer's
// device, it is the support system itself, and the reboot cheerfully
// wipes every record of the call. The line ends where the call began,
// with the greeting, so the loop never closes.
//
// The gate wants UTF-8 text of 1 to 199 characters, so the program
// checks its own line before writing it and refuses to write a line
// that would fail.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The line in its three beats: the routine hold, the cheerful reveal
// that the reboot wiped the call itself, and the greeting that starts
// the whole call over again.
const HOLD = "Please hold while I restart our support system.";
const REVEAL =
  "...Done. I now have no record of your call, your account, " +
  "or this conversation.";
const GREETING = "How can I help you today?";

const LINE = [HOLD, REVEAL, GREETING].join(" ");

const MIN_CHARS = 1;
const MAX_CHARS = 199;

function assertGate(line: string): void {
  const chars = [...line].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(`entry line is ${chars} characters, gate is ${MIN_CHARS}-${MAX_CHARS}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry line is only whitespace");
  }
  if (line.includes("\n")) {
    throw new Error("entry line must be a single line");
  }
}

function main(): void {
  assertGate(LINE);
  // OUTPUT_DIR is read as data (a path) only, so a local run can write
  // somewhere testable; the grader leaves it unset and gets /output.
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), LINE, "utf8");
}

main();
