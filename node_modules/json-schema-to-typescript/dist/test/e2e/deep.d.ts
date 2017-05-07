export declare const input: {
    type: string;
    properties: {
        foo: {
            type: string;
            oneOf: ({
                oneOf: ({
                    type: string;
                } | {
                    $ref: string;
                } | {
                    properties: {
                        baz: {
                            type: string;
                        };
                    };
                })[];
            } | {
                $ref: string;
            })[];
        };
    };
    definitions: {
        foo: {
            properties: {
                a: {
                    type: string;
                };
                b: {
                    type: string;
                };
            };
            additionalProperties: boolean;
            required: string[];
        };
        bar: {
            properties: {
                a: {
                    type: string;
                };
            };
            required: string[];
        };
    };
    required: string[];
    additionalProperties: boolean;
};
export declare const output: string;
