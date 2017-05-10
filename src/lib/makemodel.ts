/**
 * Created by snytkind on 5/8/17.
 */

let swagger = require("../../swagger.json");
import * as SwaggerParser from 'swagger-parser';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import {compile, compileFromFile} from 'json-schema-to-typescript'
import {Formatter} from './formatter';
import {SwaggerObject} from './interfaces'
import {Result} from "typescript-formatter";
const clone = require('clone');

let parser = new SwaggerParser();

const MODELS_DIR = 'src/Models';

function saveSchema(basePath: string, objName: string, definition: object): Promise<boolean> {

    const oFmt = new Formatter(basePath);
    const fileName = (objName + "_schema.ts").toLocaleLowerCase();
    const modelPath = path.join(MODELS_DIR, fileName);

    if (!definition.hasOwnProperty('$schema')) {
        // make $schema the first element, otherwise simple adding new property adds it as last
        definition = {"$schema": "http://json-schema.org/draft-04/schema#", ...definition}
    }

    const s = `// Schema for ${objName}  object
export default ${JSON.stringify(definition, null, 2)}
`;


    console.log("Saving schema: ", objName, " filename: ", modelPath);
    return oFmt.formatAndSaveIfNotExist(modelPath, s).then(result => {
        //console.log("Formatted and saved Schema Saved Schema: ", result.dest, " error: ", result.error);
        return true;
    });

}

/**
 * Updated index.ts with a "export * from './modelfile.ts'"
 *
 * @param basePath
 * @param modelName
 * @param modelFileName
 */
function updateModelsIndex(basePath, modelFileName): Promise<boolean> {
    const indexPath = path.join(basePath, MODELS_DIR, 'index.ts');
    console.log('Models/index file=', indexPath);

    const line = `export * from './${modelFileName}'\n`;

    return new Promise((resolve, reject) => {
        fs.appendFile(indexPath, line, (err) => {
            if (err) {
                console.error("Failed to update Models index file: ", util.inspect(err));
                reject(err)
            } else {
                resolve(true)
            }
        })
    })
}


function saveModel(basePath: string, objName: string, definition: object): Promise<boolean> {
// add  "$schema": "http://json-schema.org/draft-04/schema#" to object if it does not exist already

    const fileName = (objName + ".ts").toLocaleLowerCase();
    const modelPath = path.join(MODELS_DIR, fileName);
    //console.log("in saveModel modelPath=", modelPath);
    definition['additionalProperties'] = false;

    return compile(definition, objName).then(ts => {
        ts = ts.replace(/export interface [a-zA-Z0-9_]+/, `export class ${objName}`);
        ts = ts.replace(/\[k: string]: any;/g, "");
        const s = `import {JsonSchema} from 'promiseoft'
        import Schema from './${objName.toLocaleLowerCase()}_schema'
        
        @JsonSchema(Schema)
        ${ts}
        `;
        //console.log("CREATED MODEL: ", s);
        return Promise.resolve(s);
    }).then(ts => {
        const oFmt = new Formatter(basePath);
        return oFmt.formatAndSaveIfNotExist(modelPath, ts);
    }).then(result => {
        //console.log("Formatted and saved model: ", JSON.stringify(result));

        return updateModelsIndex(basePath, objName.toLocaleLowerCase());
    })
}


export class Definition2Model {

    private swagger_: SwaggerObject;
    private oFmt: Formatter;

    constructor(private readonly basePath: string) {
        const swagger = require(path.join(basePath, 'swagger.json'));
        this.swagger_ = clone(swagger);
        this.oFmt = new Formatter(basePath);

        (Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");
    }

    saveSchemaAndModel(modelName: string, schemaObj: object): Promise<boolean> {
        return saveSchema(this.basePath, modelName, schemaObj).then(_ => saveModel(this.basePath, modelName, schemaObj));
    }


    async *createModels(): AsyncIterableIterator<boolean> {

        let api = await parser.dereference(this.swagger_);
        if(api.hasOwnProperty('definitions')){
            for(let d in api.definitions){
                console.log("Inside next() iteration of createModel loop");
                yield this.saveSchemaAndModel(d, api.definitions[d]).catch(e=> {
                    console.log("Failed to save Model: ", d, " Error: ", util.inspect(e));
                    return false;
                })
            }
        }
    }
}


