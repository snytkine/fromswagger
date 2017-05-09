import { JsonSchema } from 'promiseoft'
import Schema from './cehuser_schema'

@JsonSchema(Schema)
export class CEHUser {
    _id?: string;
    userName: string;
    assocId: string;
    email: string;
    created_by?: string;
    updated_by?: string;
    updated_at?: string;
    created_at?: string;
    roles?: ("user" | "superuser")[];
    associate?: {
        last_name: string;
        first_name: string;

    };
}

