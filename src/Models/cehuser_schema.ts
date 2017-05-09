// Schema for CEHUser  object
export default {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "_id": {
            "type": "string"
        },
        "userName": {
            "type": "string"
        },
        "assocId": {
            "type": "string"
        },
        "email": {
            "type": "string"
        },
        "created_by": {
            "type": "string"
        },
        "updated_by": {
            "type": "string"
        },
        "updated_at": {
            "type": "string"
        },
        "created_at": {
            "type": "string"
        },
        "roles": {
            "type": "array",
            "items": {
                "enum": [
                    "user",
                    "superuser"
                ]
            }
        },
        "associate": {
            "type": "object",
            "properties": {
                "last_name": {
                    "type": "string"
                },
                "first_name": {
                    "type": "string"
                }
            },
            "required": [
                "last_name",
                "first_name"
            ]
        }
    },
    "required": [
        "userName",
        "assocId",
        "email"
    ]
}
