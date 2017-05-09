/**
 * Created by snytkind on 5/7/17.
 */
"use strict";
function swaggerParam2string(i, pname, ptype, defaultVal) {
    var decorator;
    var name;
    var type = "any";
    var ret = "";
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
            type = "any";
    }
    switch (i.toLocaleLowerCase()) {
        case 'path':
            decorator = "@PathParam('" + pname + "')";
            name = pname;
            break;
        case "query":
            decorator = "@QueryParam('" + pname + "')";
            break;
        case "header":
            decorator = "@HeaderParam('" + pname + "')";
            break;
        case "body":
            decorator = "@RequestBody";
            break;
        default:
            decorator = "";
    }
    if (decorator != "") {
        ret = decorator + " " + name + ":" + type;
    }
    if (ret !== "" && defaultVal) {
        ret += " = " + defaultVal;
    }
    return ret;
}
function swaggerParams2paramList(sparams) {
    var res = "";
    var imports = [];
    var aParams = [];
    // First sort array in such a way that param with default value are last
    // because params with default value have to be last arguments in function arguments list
    for (var _i = 0, sparams_1 = sparams; _i < sparams_1.length; _i++) {
        var p = sparams_1[_i];
        aParams.push(swaggerParam2string(p["in"], p.name, p.type, p['default']));
        switch (p["in"].toLocaleLowerCase()) {
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
function parseOperation(url, httpMethod, operation) {
    var summary = "";
    if (operation.summary && operation.summary.length > 0) {
        summary = "/**\n        *\n        * " + operation.summary + "\n        **/\n        ";
    }
    var imports = [httpMethod.toUpperCase(), "JsonResponse", "AppResponse"];
    var methodName = operation.operationId || "do" + httpMethod.toUpperCase();
    var parsedParams = swaggerParams2paramList(operation.parameters);
    return {
        summary: summary,
        methodName: methodName,
        methodPath: url,
        httpMethod: httpMethod,
        paramsList: parsedParams[0],
        imports: parsedParams[1],
        methodReturnType: "JsonResponse<any>"
    };
}
exports.parseOperation = parseOperation;
/**
 * Generate typescript code for one controller method
 *
 * @param methodDetails
 * @returns {string}
 */
function makeMethod(methodDetails) {
    return "\n            " + methodDetails.summary + "\n            " + methodDetails.methodPath + "\n            " + methodDetails.httpMethod + "\n            " + methodDetails.methodName + "(" + methodDetails.paramsList + "): Promise<" + methodDetails.methodReturnType + "> {\n            \n            \n            }\n            \n    ";
}
exports.makeMethod = makeMethod;
/**
 * Generate typescript code for controller class, which may have many controller methods
 *
 * @param controllerDetails
 * @returns {string}
 */
function makeController(controllerDetails) {
    var imp;
    var controllerMethods = controllerDetails.methods.map(function (m) { return makeMethod(m); }).join("\n\n");
    var allimports = [];
    controllerDetails.methods.forEach(function (v) {
        allimports = allimports.concat(v.imports);
    });
    var importsSet = new Set(allimports);
    allimports = Array.from(importsSet);
    allimports.unshift('Controller');
    imp = allimports.join(",  ");
    //let methods: string = controllerDetails.methods.join("\n\n");
    return "\n        import { " + imp + " } from 'promiseoft'\n        \n        " + controllerDetails.description + "\n        @Controller\n        export default class " + controllerDetails.controllerName + " {\n        \n        " + controllerMethods + "\n        \n        }\n    ";
}
exports.makeController = makeController;
