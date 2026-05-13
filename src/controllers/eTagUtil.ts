import { appVersion } from "../generated/appVersion.js";

export function calcETag(): string {
    if (!appVersion.includes("SNAPSHOT")) {
        // Not a snapshot version, so just use app version as ETag
        return appVersion;
    }

    // For snapshot versions also add 'now'
    const secondsSinceEpoch = Math.floor(Date.now() / 1000);

    return `${appVersion}:${secondsSinceEpoch}`;
}