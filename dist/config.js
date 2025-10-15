"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const env_core_1 = require("@t3-oss/env-core");
const zod_1 = require("zod");
exports.env = (0, env_core_1.createEnv)({
    server: {
        STRIPE_SECRET_KEY: zod_1.z.string(),
        STRIPE_ORDER_COMPLETE_WEBHOOK_SECRET: zod_1.z.string(),
        NODE_ENV: zod_1.z.enum(["development", "production", "testing"]),
        CLIENT_URL: zod_1.z.string().url(),
        DATABASE_URL: zod_1.z.string().url(),
        SESSION_SECRET: zod_1.z.string().min(32),
        PORT: zod_1.z
            .string()
            .default("3000")
            .transform(s => parseInt(s))
            .pipe(zod_1.z.number()),
    },
    isServer: true,
    runtimeEnv: process.env,
});
