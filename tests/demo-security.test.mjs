import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

function checkModules(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) checkModules(path);
    else if (/\.[cm]?[jt]sx?$/.test(entry.name)) {
      const source = readFileSync(path, "utf8");
      assert.doesNotMatch(source, /firebase|Firestore|getDocs|fetch\s*\(|XMLHttpRequest|WebSocket|EventSource/, path);
    }
  }
}

test("all demo source modules stay disconnected from live data", () => {
  checkModules(fileURLToPath(new URL("../src/", import.meta.url)));
  const source = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /value=["']live["']/);
  assert.match(source, /demoScenarios\[scenario\]\.history/);
});

test("a nested database helper fails the source boundary check", () => {
  const dir = mkdtempSync(join(tmpdir(), "demo-security-"));
  try {
    mkdirSync(join(dir, "nested"));
    writeFileSync(join(dir, "App.jsx"), 'import { loadJobs } from "./nested/data.js";');
    writeFileSync(join(dir, "nested", "data.js"), "export const loadJobs = () => getDocs(jobs);");
    assert.throws(() => checkModules(dir), /data.js/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
