/**
 * Created by snytkind on 5/8/17.
 */

let swagger = require("../../swagger.json");
import * as SwaggerParser from 'swagger-parser';
import {Fsutil} from '../fsutil';
import * as path from 'path';

let parser = new SwaggerParser();

function saveSchema(objName:string, definition: object){
// add  "$schema": "http://json-schema.org/draft-04/schema#" to object if it does not exist already

    let fSchemaPath = path.resolve(__dirname, '../../src/Models/', objName + "_schema.ts");
    let fModelPath = path.resolve(__dirname, '../../src/Models/', objName + ".ts");
    if(!definition.hasOwnProperty('$schema')){
        // make $schema the first element, otherwise simple adding new property adds it as last
        definition = { "$schema": "http://json-schema.org/draft-04/schema#", ...definition}
    }

    let s = `// Schema for ${objName}  object
export default ${JSON.stringify(definition, null, 2)}
`

    let sModel = `import {JsonSchema} form 'promiseoft'
    import Schema from './${objName}_schema.ts'
    
    export class objName
    
    `
    console.log(s);
    let fsutil = new Fsutil(path.resolve(__dirname, '../../src/Models/');
    let saved = fsutil.createFileIfNotExists(fSchemaPath, s);
    console.log("CREATED: ", saved);
    if(saved){
        let saved = fsutil.createFileIfNotExists(fModelPath, s);
    }


}

parser.dereference(swagger).then(api => {
    //console.log(JSON.stringify(api));
    saveSchema("updateCEHUser", api.definitions.updateCEHUser)
});


