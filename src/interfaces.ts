/**
 * Created by snytkind on 5/7/17.
 */
export type restRequestMethod = "get" | "post" | "put" | "delete" | "options" | "head" | "patch"

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


export interface SwaggerPathExtra {
    ['x-promise-controller']?: string
    parameters?: Array<any>
}


export type SwaggerPathMethods = {
    [K in restRequestMethod]? : SwaggerOperation
    }


export type SwaggerPath = SwaggerPathMethods & SwaggerPathExtra;

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
    pathUri: string
    controllerName: string,
    methods: Array<IMethodDetails>
}
