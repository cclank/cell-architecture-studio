import assert from "node:assert/strict";
import test from "node:test";
import { formatTargetHelp, hasExpectedAppIdentity } from "./verify-preflight.mjs";

test("recognizes the Cell Architecture Studio page identity", () => {
  assert.equal(
    hasExpectedAppIdentity({
      title: "Cell Architecture Studio",
      bodyText: "Explore life at the microscopic level",
    }),
    true,
  );
  assert.equal(
    hasExpectedAppIdentity({
      title: "Other Vite App",
      bodyText: "A different localhost application",
    }),
    false,
  );
});

test("formats actionable preflight guidance", () => {
  const help = formatTargetHelp({
    url: "http://127.0.0.1:5173/",
    chromePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });

  assert.match(help, /APP_URL=http:\/\/127\.0\.0\.1:5173\//);
  assert.match(help, /CHROME_PATH/);
  assert.match(help, /npm run dev/);
});
