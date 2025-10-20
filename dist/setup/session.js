"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSession = void 0;
const client_1 = require("@prisma/client");
const express_session_1 = __importDefault(require("express-session"));
const config_1 = require("../config");
const prisma_session_store_1 = require("@quixo3/prisma-session-store");
function setupSession(app) {
    app.use((0, express_session_1.default)({
        // name: "sid",
        secret: config_1.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: config_1.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        },
        store: new prisma_session_store_1.PrismaSessionStore(new client_1.PrismaClient(), {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    }));
}
exports.setupSession = setupSession;
