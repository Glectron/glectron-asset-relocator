import fs from "fs";

import walk from "glectron-asset-walker";

import htmlWalker from "./relocators/html.js";

async function relocator(file, options) {
    options.relocateDir = options.relocateDir || "dist";
    if (!fs.existsSync(options.relocateDir)) fs.mkdirSync(options.relocateDir, {recursive: true})
    return walk(file, [
        ["html", htmlWalker(options)]
    ], options)
}

export default relocator;