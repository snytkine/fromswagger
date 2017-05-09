/**
 * Created by snytkind on 5/9/17.
 */

import {CreateControllers} from './makecontroller'
import {Definition2Model} from './makemodel';

const util = require('util');

let cc = new CreateControllers('/Users/snytkind/WebstormProjects/fromswagger');
let cm = new Definition2Model('/Users/snytkind/WebstormProjects/fromswagger');


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
