/**
 * Created by snytkind on 5/7/17.
 */
import {IMethodDetails, parseOperation, IControllerDetails, makeMethod, makeController} from '../makemethod'


let swagger = require("../../swagger.json");

for (let path in swagger.paths) {

    if (swagger.paths.hasOwnProperty(path)) {
        for (let oper in swagger.paths[path]) {
            if (swagger.paths[path].hasOwnProperty(oper)) {

            }

        }
    }
}


let res = parseOperation('/user/{assocId}', 'get', swagger.paths['/user/{assocId}']['get']);


console.log(res);
