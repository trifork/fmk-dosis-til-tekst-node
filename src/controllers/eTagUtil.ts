import { readFileSync } from "fs";
import path from "path";

export function calcETag() {
    const appVersion: string = JSON.parse(
        readFileSync(path.join(__dirname, '../../package.json'), 'utf-8')
    ).version;

    if (appVersion.indexOf("SNAPSHOT") < 0) {
        // Not a snapshot version, so just use app version as ETag
        return appVersion;
    }

    // For snapshot versions also add 'now'
    const secondsSinceEpoch = Math.floor(Date.now() / 1000);
    return appVersion + ":" +secondsSinceEpoch ;
}