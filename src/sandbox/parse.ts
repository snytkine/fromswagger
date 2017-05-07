/**
 * Created by snytkind on 5/7/17.
 */
import {parsePathItem, makeController} from '../makemethod'
import {IControllerDetails} from '../interfaces'

let swagger = require("../../swagger.json");

let aPathItems: Array<IControllerDetails> = [];
let aControllers: string[];
for (let path in swagger.paths) {

    if (swagger.paths.hasOwnProperty(path)) {
        aPathItems.push(parsePathItem(path, swagger.paths[path]));
    }
}


aControllers = aPathItems.map(o => makeController(o));

//let res = parseOperation('/user/{assocId}', 'get', swagger.paths['/user/{assocId}']['get']);


aControllers.map(s => console.log("==================", s));
