"use strict";
var makemethod_1 = require("../makemethod");
var fmtOptions = {
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
};
var md = {
    summary: "\n            /**\n            * Get User by username\n            * \n            * @Return User object | User not found | unexpected error\n            **/",
    methodName: "getUser",
    methodPath: "@Path('/user/{assocId}')",
    httpMethod: "@GET",
    paramsList: "@PathParam('assocId') @Required assocId:string, @QueryParam('$select') select:string",
    methodReturnType: "JsonResponse<User>",
    imports: ["GET", "PathParam", "QueryParam", "Required", "JsonResponse"]
};
var cd = {
    controllerName: "User",
    description: "/**\n    * User operations\n    **/",
    methods: [md]
};
var res = makemethod_1.makeMethod(md);
var ctrl = makemethod_1.makeController(cd);
//let out = processString("G_", ctrl, fmtOptions)
console.log(ctrl);
