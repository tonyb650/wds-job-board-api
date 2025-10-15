"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUnionSchema = void 0;
const zod_1 = require("zod");
function createManyUnion(literals) {
    return zod_1.z.union(literals.map(value => zod_1.z.literal(value)));
}
function createUnionSchema(values) {
    if (values.length > 1) {
        return createManyUnion(values);
    }
    else if (values.length === 1) {
        return zod_1.z.literal(values[0]);
    }
    else if (values.length === 0) {
        return zod_1.z.never();
    }
    throw new Error("Array must have a length");
}
exports.createUnionSchema = createUnionSchema;
