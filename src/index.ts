#!/usr/bin/env node

import {Fsutil} from './lib/fsutil';
import {CreateControllers} from './lib/makecontroller'
import {Definition2Model} from './lib/makemodel';


const util = require('util');
let mypath = process.cwd();

console.log(mypath);

let o = new Fsutil(mypath);
let aDirs = ["src/Controllers", "src/Models"];
o.createDir('src');
o.createDirs(aDirs);


let cc = new CreateControllers(mypath);
let cm = new Definition2Model(mypath);


async function makeModels(): Promise<[number, number]> {

    let i = 0, j = 0;
    try {
        for await (const x of  cm.createModels()) {
            console.log("Fulfilled one model. Created: " + util.inspect(x));
            i++;
            if(x){
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


makeModels().then(makeControllers).then(result => {
    console.log(result);
}).catch(e => {
    console.error("INSIDE Code Generator .catch with Error: ", util.inspect(e));
});
