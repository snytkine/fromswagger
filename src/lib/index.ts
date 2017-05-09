/**
 * Created by snytkind on 5/9/17.
 */

import {CreateControllers} from './makecontroller'
const util = require('util');

let cc = new CreateControllers('/Users/snytkind/WebstormProjects/fromswagger');

async function f() {

    let i = 0;
    for await (const x of  cc.createControllers()) {

        /*x.catch(e => {
         console.error("CreateController Error: ", e);
         })*/
        console.log("Fulfilled one controller. Created: " + util.inspect(x));
        i++;

    }

    return `Processed ${i} controllers`;

}


f().then(result => {
    console.log("f() is Done with result: ", result);
}).catch(e => {
    console.error("INSIDE f().catch with error: ", e);
});
