/**
 * Created by snytkind on 5/7/17.
 */
import {SwaggerOperation, SwaggerParam, SwaggerSchemaRef, SwaggerPath, IControllerDetails, IMethodDetails} from './interfaces'

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


function swaggerParam2string(i: string, pname: string, ptype: string, required, defaultVal): string {

    let decorator: string;
    let _required: string = "";
    let name: string;
    let type: string = "any";
    let ret = "";


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
            name = pname;
            break;
        default:
            decorator = ""
    }

    if (decorator != "") {
        ret = `${decorator} ${_required}${name}:${type}`;
    }

    if (ret !== "" && defaultVal) {
        ret += ` = "${defaultVal}"`;
    }

    return ret;
}


/**
 * Convert array of SwaggerParam into tuple [methodParams, array of promiseofT imports]
 * @param sparams
 * @returns {[string,string[]]}
 */
function swaggerParams2paramList(sparams: Array<SwaggerParam>): [string, string[]] {

    let res = "";
    let imports: string[] = [];
    let aParams: string[] = [];

    // If input array is empty then just return empty values
    if (!sparams || sparams.length == 0) {
        return ["", []];
    }

    // First sort array in such a way that param with default value are last
    // because params with default value have to be last arguments in function arguments list
    sparams.sort((p1, p2) => {
        return (p2.default) ? -1 : 1
    });

    for (let p of sparams) {
        aParams.push(swaggerParam2string(p.in, p.name, p.type, p['required'], p['default']));
        switch (p.in.toLocaleLowerCase()) {
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
    }

    return [res, imports];
}


/**
 *
 * Parse one operation for a uri and return object of IMethodDetails type
 *
 **/
export function parseOperation(url: string, httpMethod: string, operation: SwaggerOperation): IMethodDetails {

    let summary: string = "";
    if (operation.summary && operation.summary.length > 0) {
        summary = `/**
        *
        * ${operation.summary}
        **/
        `
    }

    let imports: string[] = [httpMethod.toUpperCase(), "JsonResponse", "AppResponse"];
    let methodName = operation.operationId || `do${httpMethod.toUpperCase()}`;

    let parsedParams = swaggerParams2paramList(operation.parameters);

    return {
        summary: summary,
        methodName: methodName,
        methodPath: `@Path('${url}')`,
        httpMethod: `@${httpMethod.toUpperCase()}`,
        paramsList: parsedParams[0],
        imports: imports.concat(parsedParams[1]),
        methodReturnType: "JsonResponse<any>"
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
            ${methodDetails.methodPath}
            ${methodDetails.httpMethod}
            ${methodDetails.methodName}(${methodDetails.paramsList}): Promise<${methodDetails.methodReturnType}> {
            
            
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

    controllerDetails.methods.forEach(v => {
        allimports = allimports.concat(v.imports);
    });

    let importsSet = new Set(allimports);
    allimports = Array.from(importsSet);
    allimports.unshift('Controller');
    imp = allimports.join(",  ");

    return `
        import { ${imp} } from 'promiseoft'
        
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