import { readFileSync, writeFileSync } from "node:fs";

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf-8")
);

const content = `// AUTO-GENERATED FILE. DO NOT EDIT.

export const appVersion = "${pkg.version}";
`;

writeFileSync("src/generated/appVersion.ts", content);
