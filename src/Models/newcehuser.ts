import { JsonSchema } from 'promiseoft'
import Schema from './newcehuser_schema'

@JsonSchema(Schema)
export class NewCEHUser {
    userName: string;
    assocId: string;
    email: string;
    associate?: {
        last_name: string;
        first_name: string;

    };
}

