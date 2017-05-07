import {makeMethod, makeController} from '../makemethod'
import {IMethodDetails, IControllerDetails} from '../interfaces'
import {processString} from 'typescript-formatter'

let fmtOptions = {
    "baseIndentSize": 0,
    "indentSize": 4,
    "tabSize": 4,
    "indentStyle": 2,
    "newLineCharacter": "\r\n",
    "convertTabsToSpaces": true,
    "insertSpaceAfterCommaDelimiter": true,
    "insertSpaceAfterSemicolonInForStatements": true,
    "insertSpaceBeforeAndAfterBinaryOperators": true,
    "insertSpaceAfterConstructor": false,
    "insertSpaceAfterKeywordsInControlFlowStatements": true,
    "insertSpaceAfterFunctionKeywordForAnonymousFunctions": false,
    "insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis": false,
    "insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets": false,
    "insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces": true,
    "insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces": false,
    "insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces": false,
    "insertSpaceAfterTypeAssertion": false,
    "insertSpaceBeforeFunctionParenthesis": false,
    "placeOpenBraceOnNewLineForFunctions": false,
    "placeOpenBraceOnNewLineForControlBlocks": false
}

let md: IMethodDetails = {
    summary: `
            /**
            * Get User by username
            * 
            * @Return User object | User not found | unexpected error
            **/`,
    methodName: "getUser",
    methodPath: "@Path('/user/{assocId}')",
    httpMethod: "@GET",
    paramsList: "@PathParam('assocId') @Required assocId:string, @QueryParam('$select') select:string",
    methodReturnType: "JsonResponse<User>",
    imports: ["GET", "PathParam", "QueryParam", "Required", "JsonResponse"]
}


let cd: IControllerDetails = {
    pathUri: "",
    controllerName: "User",
    methods: [md]
}



let res = makeMethod(md);
let ctrl = makeController(cd);
//let out = processString("G_", ctrl, fmtOptions)

console.log(ctrl);