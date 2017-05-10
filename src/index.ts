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


async function makeModels() {

    let i = 0;
    try {
        for await (const x of  cm.createModels()) {
            console.log("Fulfilled one model. Created: " + util.inspect(x));
            i++;

        }
    } catch (ex){
        console.error("Caught EX inside makeModels for..of: ", util.inspect(ex));
    }

    return i;

}

async function makeControllers(numModels:number) {

    let i = 0;
    try {
        for await (const x of  cc.createControllers()) {
            console.log("Fulfilled one controller. Created: " + util.inspect(x));
            i++;

        }
    } catch (ex){
        console.error("Caught EX inside for..of: ", util.inspect(ex));
    }

    return `Processed ${numModels} Models And ${i} Controllers`;

}


makeModels().then(makeControllers).then(result => {
    console.log(result);
}).catch(e => {
    console.error("INSIDE Code Generator .catch with error: ", e);
});
