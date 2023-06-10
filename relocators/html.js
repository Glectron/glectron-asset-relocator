import fs from "fs";
import path from "path";

import walker from "glectron-asset-walker";

import cssWalker from "./css.js";
import { randomString } from "../util.js";

function relocatorWalker(dir) {
    return async function({element, attribute, asset}) {
        const id = randomString(8);
        const ext = path.extname(asset);
        fs.copyFileSync(asset, path.resolve(dir, id + ext));
        element.setAttribute(attribute, "asset://garrysmod/relocator/" + id + ext);
    }
}

export default function(options) {
    return async function(walk) {
        walk("script[src]", "src", relocatorWalker(options.relocateDir));
        walk("link[href]", "href", async ({element, attribute, asset}) => {
            element.set_content(await walker(asset, [["css", cssWalker(options)]]));
            element.tagName = "style";
            element.removeAttribute("rel");
            element.removeAttribute(attribute);
        });
        walk("img[src]", "src", relocatorWalker(options.relocateDir));
        walk("audio[src]", "src", relocatorWalker(options.relocateDir));
    }
}