/**
 * Created by snytkind on 5/7/17.
 */
import {parsePathItem, makeController} from '../makemethod'
import {Result} from "typescript-formatter";

import {IControllerDetails} from '../interfaces'
const fs = require('fs');
const path = require('path');
import * as tsfmt from "typescript-formatter";

let swagger = require("../../swagger.json");

let aPathItems: Array<IControllerDetails> = [];
let aControllers: string[];
for (let path in swagger.paths) {

    if (swagger.paths.hasOwnProperty(path)) {
        aPathItems.push(parsePathItem(path, swagger.paths[path]));
    }
}

const formatterOptions = {
    dryRun: false,
    replace: true,
    verify: false,
    tsconfig: true,
    tslint: true,
    editorconfig: true,
    tsfmt: true,
    tsconfigFile: path.resolve(__dirname, "../../tsconfig.json"),
    tslintFile: null,
    vscode: null,
    tsfmtFile: null
}

aControllers = aPathItems.map(o => makeController(o));


// now save controllers to files

aPathItems.forEach((o, i) => {
    let fname = `controller${i + 1}`;
    if (o.controllerName) {
        fname = o.controllerName.toLocaleLowerCase();
    }

    try {
        let ctrlPath = path.resolve(__dirname, '../../src/Controllers/', fname + ".ts");
        console.log("Resolved controller path=", ctrlPath);
        if (fs.existsSync(ctrlPath)) {
            console.log("Controller file already exists in ", ctrlPath);
        } else {
            let sCtrl = makeController(o);
            tsfmt.processString(ctrlPath, sCtrl, formatterOptions);
            //fs.writeFileSync(ctrlPath, sCtrl);

        }
    } catch (e) {
        console.error("Failed to save controller file ", e.message);
        console.log("Curr dir: ", __dirname);
    }
});
//let res = parseOperation('/user/{assocId}', 'get', swagger.paths['/user/{assocId}']['get']);


//aControllers.map(s => console.log("==================", s));
