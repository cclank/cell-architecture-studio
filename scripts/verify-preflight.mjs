const expectedAppName = "Cell Architecture Studio";

export function hasExpectedAppIdentity({ title = "", bodyText = "" }) {
  return title.includes(expectedAppName) || bodyText.includes(expectedAppName);
}

export function formatTargetHelp({ url, chromePath }) {
  return [
    "Visual verification needs a running local app and a Chrome executable.",
    `Start the app first with: npm run dev`,
    `Then run: APP_URL=${url} npm run verify`,
    `If Chrome is installed elsewhere, run: CHROME_PATH="${chromePath}" npm run verify`,
  ].join("\n");
}
