/**
 * Created by snytkind on 5/7/17.
 */


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

export interface SwaggerSchemaRef {
    $ref: string
}

export interface SwaggerParam {
    name: string
    in: string
    description?: string
    required?: boolean
    type: string
    schema?: SwaggerSchemaRef
    default?: any
}

export interface SwaggerResponse {
    description?: string
    schema?: SwaggerSchemaRef
}

export interface SwaggerOperation {
    operationId?: string
    summary?: string
    parameters?: Array<SwaggerParam>
    responses: { [key: string]: any }
    tags?: Array<string>
}

export interface IMethodDetails {
    summary: string
    methodName: string
    methodPath: string
    httpMethod: string
    paramsList: string
    methodReturnType: string
    imports: Array<string>
}


export interface IControllerDetails {

    controllerName: string,
    description: string,
    methods: Array<IMethodDetails>
}


function swaggerParam2string(i: string, pname: string, ptype: string, defaultVal): string {

    let decorator: string;
    let name: string;
    let type: string = "any";
    let ret = "";

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
        ret = `${decorator} ${name}:${type}`;
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

    // First sort array in such a way that param with default value are last
    // because params with default value have to be last arguments in function arguments list

    for (let p of sparams) {
        aParams.push(swaggerParam2string(p.in, p.name, p.type, p['default']));
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

    res = aParams.join(", ");


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
        methodPath: url,
        httpMethod: httpMethod,
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
export function makeController(controllerDetails: IControllerDetails) {

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

    //let methods: string = controllerDetails.methods.join("\n\n");

    return `
        import { ${imp} } from 'promiseoft'
        
        ${controllerDetails.description}
        @Controller
        export default class ${controllerDetails.controllerName} {
        
        ${controllerMethods}
        
        }
    `
}