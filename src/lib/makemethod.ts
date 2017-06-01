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
const X_CONTROLLER_NAME = 'x-controller-name';

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
export function parseOperation(url: string, httpMethod: string, operation: SwaggerOperation, pathID: number): IMethodDetails {

  const ctrlName = operation[X_CONTROLLER_NAME] || `controller${pathID}`;
  const isNamedController = operation.hasOwnProperty(X_CONTROLLER_NAME);

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
  let responseType = "JsonResponse";
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
                // JsonResponse is not generic at this time, later it will be
                //responseType = `JsonResponse<${model}>`;
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
    pathUri: url,
    controllerName: ctrlName,
    isNamedController: isNamedController,
    responseDescription: responseDescription,
    methodName: methodName,
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

  const pathAnnotation = methodDetails.pathUri.length > 0 ? `\n@Path('${methodDetails.pathUri}')` : '';

  return `${methodDetails.summary}${pathAnnotation}          
            ${methodDetails.httpMethod}
            async ${methodDetails.methodName}(${methodDetails.paramsList}): Promise<${methodDetails.methodReturnType}> {
            
            
            }`;
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
        @Path('${controllerDetails.pathUri}')
        export default class ${controllerDetails.controllerName} {
        
        ${controllerMethods}
        
        }
    `
}


export function parsePathElement(pathUri: string, sp: SwaggerPath, pathID: number): Array<IMethodDetails> {
  //const ctrlName = sp[X_CONTROLLER_NAME] || `controller${pathID}`;
  let methods: Array<IMethodDetails> = [];

  for (let m of aRestMethods) {
    if (sp.hasOwnProperty(m)) {
      methods.push(parseOperation(pathUri, m, sp[m], pathID));
    }
  }

  return methods;
}


/**
 * Parse one path Item of Swagger paths object and return IControllerDetails object
 * @param path
 * @param sp
 * @returns {{pathUri: string, controllerName: (any|string), methods: Array<IMethodDetails>}}
 */
export function parsePathItem(path: string, sp: SwaggerPath): IControllerDetails {

  let methods: Array<IMethodDetails> = [];
  let ctrlName = sp[X_CONTROLLER_NAME] || "";

  for (let m of aRestMethods) {
    if (sp.hasOwnProperty(m)) {
      methods.push(parseOperation(path, m, sp[m], 0))
    }
  }

  return {
    pathUri: path,
    controllerName: ctrlName,
    methods: methods
  }


}

/**
 * Takes array of IMethodDetails and groups then by x-controller-name key that can be in swagger in each http method
 *
 * @param aMethods
 * @returns {Array<IControllerDetails>}
 */
export function groupMethodDetailsByController(aMethods: Array<IMethodDetails>): Array<IControllerDetails> {


  console.log("~~~~~~~ENTERED groupMethodDetailsByController with total: ~~~~", aMethods.length);
  let perController = aMethods.reduce((acc, cur) => {

    if (!acc.hasOwnProperty(cur.controllerName)) {
      acc[cur.controllerName] = {
        pathUri: cur.pathUri,
        controllerName: cur.controllerName,
        methods: []
      }
    }

    acc[cur.controllerName].methods.push(cur);

    return acc;

  }, {});

  let res: Array<IControllerDetails> = [];

  for (let k in perController) {
    if (perController.hasOwnProperty(k)) {
      res.push(perController[k]);
    }
  }

  console.log("groupMethodDetailsByController returning: ", JSON.stringify(res));

  return res;
}

/**
 * A common path of 2 uris is the the string
 * that has the same uri path segments for both uris
 * without the ending slash
 *
 * Implement a function that takes 2 strings and returns the
 * longest common path
 *
 * For the url1 and url2 in the example above the
 * longer common path is /package/users/v1_0/user
 *
 */
const getCommonPath = (s1: string, s2: string): string => {

  const PATH_SEP = "/";
  let pos = 0;

  for (let i = 0; i <= s2.length; i += 1) {
    if (s1[i] !== s2[i]) {
      return s1.substring(0, pos);
    }
    if (s2[i] === PATH_SEP || i === s1.length || i === s2.length) {
      pos = i
    }
  }

  return s1.substr(0, pos);

};


const longestCommon = (paths: string[]): string => {

  return paths.reduce((prev, cur) => {
    return getCommonPath(prev, cur);
  }, paths[0])
};


/**
 * When controller has multiple methods
 * find the longest common path for all methods and use it
 * as @Path decorator on controller. The method's @Path values
 * will then subtract that contoller path prefix
 *
 * @param controllerDetails
 * @return array of IControllerDetails with values of pathUri updated
 *
 */
export function adjustComprollerPaths(controllerDetails: Array<IControllerDetails>): Array<IControllerDetails> {


  const res = controllerDetails.map(ctrl => {

    const lcp = longestCommon(ctrl.methods.map(_ => _.pathUri));
    console.log(`@@@@@@@@ Found lcp for ${ctrl.controllerName}: ${lcp}`);

    ctrl.pathUri = lcp;

    ctrl.methods = ctrl.methods.map(method => {
      method.pathUri = method.pathUri.substring(lcp.length);
      console.log(`######## New pathUri for method: ${ctrl.controllerName}.${method.methodName} = ${method.pathUri}`);
      return method;
    });

    return ctrl;
  });


  console.log(`Returning adjusted controller details: ${JSON.stringify(res)}`);
  return res;
}