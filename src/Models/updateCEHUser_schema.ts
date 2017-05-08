// Schema for updateCEHUser  object
export default {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "email": {
      "type": "string"
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
  }
}
