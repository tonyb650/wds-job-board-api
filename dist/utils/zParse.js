"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zParse = void 0;
const zod_1 = require("zod");
const zod_validation_error_1 = require("zod-validation-error");
async function zParse(object, schema, res) {
    try {
        return await schema.parseAsync(object);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ message: (0, zod_validation_error_1.fromZodError)(error).message });
        }
        else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
exports.zParse = zParse;
