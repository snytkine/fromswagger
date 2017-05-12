#!/usr/bin/env node

import {Fsutil} from './lib/fsutil';
import {CreateControllers} from './lib/makecontroller'
import {Definition2Model} from './lib/makemodel';
import app_ts from './lib/app';
import {FileTemplates} from './lib/settings';

const util = require('util');
const mypath = process.cwd();

const SRC_DIR = "src";
const SETTINGS_DIR = "src/Settings/";
const COMPONENTS_DIR = "src/Components";
const MIDDLEWARE_DIR = "src/Middleware";
const MODELS_DIR = "src/Models";
const CONTROLLERS_DIR = "src/Controllers";

console.log(`Starting generating project files in ${mypath}`);

let o = new Fsutil(mypath);
let aDirs = [CONTROLLERS_DIR, MODELS_DIR, COMPONENTS_DIR, SETTINGS_DIR, MIDDLEWARE_DIR];
o.createDir(SRC_DIR);
o.createDirs(aDirs);
o.createFileIfNotExists(SRC_DIR + '/app.ts', app_ts);

for (const ft of FileTemplates) {
    o.createFileIfNotExists(SETTINGS_DIR + ft[0], ft[1]);
}

let cc = new CreateControllers(mypath);
let cm = new Definition2Model(mypath);


async function makeModels(): Promise<[number, number]> {

    let i = 0, j = 0;
    try {
        for await (const x of  cm.createModels()) {
            console.log("Fulfilled one model. Created: " + util.inspect(x));
            i++;
            if (x) {
                j++;
            }

        }
    } catch (ex) {
        console.error("Caught EX inside makeModels for..of: ", util.inspect(ex));
    }

    return [i, j];

}

async function makeControllers(numModels: [number, number]): Promise<string> {

    let i = 0, j = 0;
    try {
        for await (const x of  cc.createControllers()) {
            console.log("Fulfilled one controller. Created: " + util.inspect(x));

            i++;
            if (x) {
                j++
            }

        }
    } catch (ex) {
        console.error("Caught EX inside for..of: ", util.inspect(ex));
    }

    return `============================\nModels Processed ${numModels[0]}. Models Created: ${numModels[1]}.\nControllers Processed: ${i}. Controllers Created: ${j}`;
}

let mypaths = cc.parsePaths();
console.log("parsePaths done");

console.log(JSON.stringify(mypaths));

process.exit(1);


makeModels().then(makeControllers).then(result => {
    console.log(result);
}).catch(e => {
    console.error("INSIDE Code Generator .catch with Error: ", util.inspect(e));
});
