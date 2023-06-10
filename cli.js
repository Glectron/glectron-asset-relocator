import fs from "fs";
import path from "path";

import watch from "node-watch";
import minimist from 'minimist';
import relocate from './index.js';

const argv = minimist(process.argv.slice(2));

const targetFile = argv._[0];
const outputFile = argv.o || argv.output;
const relocateDir = argv.r || argv.relocate;
const watchDir = argv.w || argv.watch;
const minifyHtml = (argv.h || argv.minifyhtml) !== undefined;

async function runRelocate() {
    const result = await relocate(path.resolve(process.cwd(), targetFile), {
        relocateDir,
        minifyHtml
    });
    if (outputFile) {
        fs.writeFileSync(path.resolve(process.cwd(), outputFile), result, "utf-8");
    } else {
        console.log(result);
    }
}

await runRelocate();

if (watchDir) {
    console.log("Watching", path.resolve(process.cwd(), watchDir), "for changes...");
    const watcher = watch(path.resolve(process.cwd(), watchDir), {recursive: true}, async (_e, _file) => {
        await runRelocate();
        console.log("File updated");
    });
    process.on('SIGINT', () => {
        watcher.close();
    });
    process.on('SIGTERM', () => {
        watcher.close();
    });
}