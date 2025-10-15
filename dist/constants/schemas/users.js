"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default
        .string()
        .min(8)
        .regex(/[0-9]/, "Must contain a number")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[a-z]/, "Must contain a lowercase letter"),
});
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.string().email().nonempty(),
    password: zod_1.default.string().nonempty(),
});
