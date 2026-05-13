import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf-8")
);

const outDir = "src/generated";
const outFile = path.join(outDir, "appVersion.ts");

// ensure directory exists (recursive = creates parents if needed)
mkdirSync(outDir, { recursive: true });

const content = `// AUTO-GENERATED FILE. DO NOT EDIT.

export const appVersion = "${pkg.version}";
`;

writeFileSync(outFile, content);