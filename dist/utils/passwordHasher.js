"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const ITERATIONS = 1000;
const KEY_LENGTH = 64;
const ALGORITHM = "sha512";
function hashPassword(password) {
    const salt = crypto_1.default.randomBytes(16).toString("hex");
    const hash = crypto_1.default
        .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, ALGORITHM)
        .toString("hex");
    return { salt, hash };
}
exports.hashPassword = hashPassword;
function verifyPassword(password, salt, hash) {
    const hashToVerify = crypto_1.default
        .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, ALGORITHM)
        .toString("hex");
    return hash === hashToVerify;
}
exports.verifyPassword = verifyPassword;
