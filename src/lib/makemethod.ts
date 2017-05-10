/**
 * Created by snytkind on 5/7/17.
 */
import {
    SwaggerOperation,
    SwaggerParam,
    SwaggerSchemaRef,
    SwaggerPath,
    IControllerDetails,
    IMethodDetails
} from './interfaces'

/**
 * {
            "name": "assocId",
            "in": "path",
            "description": "6-digit ADP associate id",
            "required": true,
            "type": "string",
            "format": "string"
          }
 */

let aRestMethods = ["get", "post", "put", "delete", "options", "head", "patch"];

function modelNameFromParamSchema(param: SwaggerParam): string {
    let ret: string = "";

    if (param.schema && param.schema['$ref']) {
        const a = param.schema['$ref'].split("/");
        if (a.length > 0) {
            ret = a[a.length - 1];
            console.log("Extracted paramType from schema.$ref: ", ret);
        }
    }


    return ret;
}

function swaggerParam2string(param: SwaggerParam): [string, string] {

    let decorator: string;
    let _required: string = "";
    let name: string;
    let type: string = "any";
    let bodyModel = "";
    let ret: [string, string] = ["", bodyModel];

    let i: string = param['in'];
    let pname: string = param.name
    let ptype: string = param.type
    let required = param.required;
    let defaultVal = param.default;

    if (required) {
        _required = "@Required ";
    }

    switch (ptype) {
        case "number":
        case "integer":
            type = "number";
            break;

        case "boolean":
            type = "boolean";
            break;

        case "string":
            type = "string";
            break;

        default:
            type = "any"
    }

    switch (i.toLocaleLowerCase()) {
        case 'path':
            decorator = `@PathParam('${pname}')`;
            name = pname;
            break;

        case "query":
            decorator = `@QueryParam('${pname}')`;
            name = pname;
            break;

        case "header":
            decorator = `@HeaderParam('${pname}')`;
            name = pname;
            break;

        case "body":
            decorator = "@RequestBody";
            type = modelNameFromParamSchema(param) || "any";
            if (type != "any") {
                bodyModel = type;
            }
            name = pname;
            break;
        default:
            decorator = ""
    }

    if (decorator != "") {
        ret = [`${decorator} ${_required}${name}:${type}`, bodyModel];
    }

    if (ret[0] !== "" && defaultVal) {
        ret[0] += ` = "${defaultVal}"`;
    }

    return ret;
}


/**
 * Convert array of SwaggerParam into tuple [methodParams, array of promiseofT imports]
 * @param sparams
 * @returns {[string,string[], string[]} params line, array of promiseoft imports, array of extra import lines (for model imports)
 */
function swaggerParams2paramList(sparams: Array<SwaggerParam>): [string, string[], string[]] {

    let res = "";
    let imports: string[] = [];
    let aParams: string[] = [];
    let extraImports: string[] = [];

    // If input array is empty then just return empty values
    if (!sparams || sparams.length == 0) {
        return ["", [], extraImports];
    }

    // First sort array in such a way that param with default value are last
    // because params with default value have to be last arguments in function arguments list
    sparams.sort((p1, p2) => {
        return (p2.default) ? -1 : 1
    });

    for (let p of sparams) {
        let x = swaggerParam2string(p);
        if (x[1] != "") {
            extraImports.push(`import {${x[1]}} from '../Models'`);
        }

        aParams.push(x[0]);
        if (p.required) {
            imports.push("Required");
        }
        switch (p['in'].toLocaleLowerCase()) {
            case 'path':
                imports.push("PathParam");
                break;

            case 'query':
                imports.push("QueryParam");
                break;

            case 'header':
                imports.push("HeaderParam");
                break;

            case 'body':
                imports.push("RequestBody");
                break;
        }
    }

    if (aParams.length > 0) {
        res = aParams.join(", ");
        //console.log(`PARAMS LIST: (${res})`);
    }

    return [res, imports, extraImports];
}


/**
 *
 * Parse one operation for a uri and return object of IMethodDetails type
 *
 **/
export function parseOperation(url: string, httpMethod: string, operation: SwaggerOperation): IMethodDetails {

    let summary: string = "";
    if (operation.summary && operation.summary.length > 0) {
        summary = `
        /**
        * ${operation.summary}
        **/`
    }

    let imports: string[] = [httpMethod.toUpperCase(), "JsonResponse", "AppResponse"];
    let methodName = operation.operationId || `do${httpMethod.toUpperCase()}`;

    let parsedParams = swaggerParams2paramList(operation.parameters);

    let responseDescription = "";
    let responseType = "JsonResponse<any>";
    let extraImports: Set<string> = new Set<string>();

    if (parsedParams[2].length > 0) {
        for (const j of parsedParams[2]) {
            extraImports.add(j);
        }
    }


    if (operation.responses) {
        for (const Code in operation.responses) {
            let httpCode = parseInt(Code, 10);
            if (!isNaN(httpCode) && httpCode >= 200 && httpCode < 300) {
                // if httpCode 200 then use it as response
                // otherwise ? now sure but probably just use JsonResponse<any> then
                console.log("parsing response type in methodName ", methodName, " for code: ", Code);
                if (operation.responses[Code]['schema']) {
                    // have schema. Now look for $ref
                    // if $ref not found then the schema is defined inline
                    // in which case we need to save that schema as schema and model in the /Models and then use it here
                    if (operation.responses[Code]['schema']['$ref']) {
                        // add extra import like to import model for response from Models dir. Models dir is sibling of Controller Dir
                        // so we can use relative path: import {model} from '../Models'
                        let a = operation.responses[Code]['schema']['$ref'].split("/")
                        if (a.length > 0) {
                            let model = a[a.length - 1]
                            if (model) {
                                extraImports.add(`import {${model}} from '../Models'`);
                                responseType = `JsonResponse<${model}>`;
                            }
                        }
                    }

                } else {
                    console.log("No schema in response for code ", Code, " in method ", methodName);
                    // use just AppResponse, not JsonResponse in this case
                    // even better is to define special type of IAppResponse CodeOnlyResponse<HttpResponseCode>
                    // CodeOnlyResponse<HttpResponseCode.SUCCESS>
                }
            }
        }
    }

    return {
        summary: summary,
        responseDescription: responseDescription,
        methodName: methodName,
        methodPathAnnotation: `@Path('${url}')`,
        httpMethod: `@${httpMethod.toUpperCase()}`,
        paramsList: parsedParams[0],
        imports: imports.concat(parsedParams[1]),
        extraImports: extraImports,
        methodReturnType: responseType
    }


}

/**
 * Generate typescript code for one controller method
 *
 * @param methodDetails
 * @returns {string}
 */
export function makeMethod(methodDetails: IMethodDetails): string {

    return `
            ${methodDetails.summary}
            ${methodDetails.methodPathAnnotation}
            ${methodDetails.httpMethod}
            async ${methodDetails.methodName}(${methodDetails.paramsList}): Promise<${methodDetails.methodReturnType}> {
            
            
            }
            
    `;
}


/**
 * Generate typescript code for controller class, which may have many controller methods
 *
 * @param controllerDetails
 * @returns {string}
 */
export function makeController(controllerDetails: IControllerDetails): string {

    let imp: string;
    let controllerMethods = controllerDetails.methods.map(m => makeMethod(m)).join("\n\n");
    let allimports: string[] = [];
    let modelImports: Set<string> = new Set<string>();

    controllerDetails.methods.forEach(v => {
        allimports = allimports.concat(v.imports);
        for (const imp of v.extraImports) {
            modelImports.add(imp);
        }
    });

    let sModelImports: string = "";
    let aModelImports = Array.from(modelImports);
    //if(aModelImports.length > 0){
    sModelImports = aModelImports.join("\n");
    //}
    let importsSet = new Set(allimports);
    allimports = Array.from(importsSet);
    allimports.unshift('Path');
    allimports.unshift('Controller');

    imp = allimports.join(",  ");


    return `import { ${imp} } from 'promiseoft'
        ${sModelImports}

        @Controller
        export default class ${controllerDetails.controllerName} {
        
        ${controllerMethods}
        
        }
    `
}


/**
 * Parse one path Item of Swagger paths object and return IControllerDetails object
 * @param path
 * @param sp
 * @returns {{pathUri: string, controllerName: (any|string), methods: Array<IMethodDetails>}}
 */
export function parsePathItem(path: string, sp: SwaggerPath): IControllerDetails {

    let methods: Array<IMethodDetails> = [];
    let ctrlName = sp['x-promise-controller'] || "";

    for (let m of aRestMethods) {
        if (sp.hasOwnProperty(m)) {
            methods.push(parseOperation(path, m, sp[m]));
        }
    }

    return {
        pathUri: path,
        controllerName: ctrlName,
        methods: methods
    }


}