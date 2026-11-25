// Local verification for the entry.
//
// Runs main.ts twice into two scratch directories and checks that the
// two entry.txt files are byte-identical, then re-checks the written
// text against the gate: UTF-8, 1 to 199 characters, not only white
// space, single line. Exits non-zero on any failure.
//
//   node verify.mjs

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function runOnce() {
  const dir = mkdtempSync(join(tmpdir(), "turning-it-off-"));
  execFileSync("node", ["main.ts"], {
    env: { ...process.env, OUTPUT_DIR: dir },
    stdio: "pipe",
  });
  return readFileSync(join(dir, "entry.txt"));
}

const first = runOnce();
const second = runOnce();

if (!first.equals(second)) {
  console.error("FAIL: two runs differ");
  process.exit(1);
}

const text = first.toString("utf8");
const chars = [...text].length;
if (chars < 1 || chars > 199) {
  console.error(`FAIL: ${chars} characters, gate is 1-199`);
  process.exit(1);
}
if (text.trim().length === 0 || text.includes("\n")) {
  console.error("FAIL: whitespace-only or multi-line");
  process.exit(1);
}

console.log(`ok: two runs byte-identical, ${chars} characters, ${first.length} bytes`);
console.log(`line: ${text}`);
