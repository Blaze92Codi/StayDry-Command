import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
test("demo cannot initiate a live database read", () => {
  const source = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /firebase|Firestore|getDocs|setMode/);
  assert.doesNotMatch(source, /value=["\']live["\']/);
  assert.match(source, /demoScenarios\[scenario\]\.history/);
});
