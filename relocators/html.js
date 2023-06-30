import fs from "fs";
import path from "path";

import walker from "@glectron/asset-walker";

import cssWalker from "./css.js";
import { randomString } from "../util.js";

function relocatorWalker(dir, content) {
    return async function({element, attribute, asset}) {
        const id = randomString(8);
        const ext = path.extname(asset);
        const target = path.resolve(dir, id + ext);
        if (content) {
            fs.writeFileSync(target, content, "utf-8");
        } else {
            fs.copyFileSync(asset, target);
        }
        element.setAttribute(attribute, "asset://garrysmod/relocator/" + id + ext);
    }
}

export default function(options) {
    return async function(walk) {
        walk("script[src]", "src", relocatorWalker(options.relocateDir));
        walk("link[href]", "href", async ({element, attribute, asset}) => {
            return relocatorWalker(options.relocateDir, await walker(asset, [cssWalker(options)], options))({
                element,
                attribute,
                asset
            });
        });
        walk("img[src]", "src", relocatorWalker(options.relocateDir));
        walk("audio[src]", "src", relocatorWalker(options.relocateDir));
    }
}