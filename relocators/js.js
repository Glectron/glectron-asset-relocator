import fs from "fs";
import path from "path";

import { randomString } from "../util.js";

export default function(options) {
    return async function({literal, asset}) {
        const id = randomString(8);
        const ext = path.extname(asset);
        fs.copyFileSync(asset, path.resolve(options.relocateDir, id + ext));
        literal.value = "asset://garrysmod/relocator/" + id + ext;
    }
}