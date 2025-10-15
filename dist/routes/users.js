"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const zParse_1 = require("../utils/zParse");
const passwordHasher_1 = require("../utils/passwordHasher");
const db_1 = require("../db");
const users_1 = require("../constants/schemas/users");
exports.usersRouter = (0, express_1.Router)();
exports.usersRouter.post("/login", async (req, res) => {
    const body = await (0, zParse_1.zParse)(req.body, users_1.loginSchema, res);
    if (body == null)
        return;
    const user = await db_1.db.user.findUnique({
        where: { email: body.email },
    });
    if (user == null ||
        !(0, passwordHasher_1.verifyPassword)(body.password, user.salt, user.password)) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }
    req.session.user = user;
    req.session.save(() => {
        res.json({ id: user.id, email: user.email });
    });
});
exports.usersRouter.post("/signup", async (req, res) => {
    const body = await (0, zParse_1.zParse)(req.body, users_1.signupSchema, res);
    if (body == null)
        return;
    const existingUser = await db_1.db.user.findUnique({
        where: { email: body.email },
    });
    if (existingUser != null) {
        return res
            .status(400)
            .json({ message: "An account already exists for that email" });
    }
    const { hash, salt } = (0, passwordHasher_1.hashPassword)(body.password);
    const user = await db_1.db.user.create({
        data: {
            email: body.email,
            password: hash,
            salt: salt,
        },
    });
    req.session.user = user;
    req.session.save(() => {
        res.json({ id: user.id, email: user.email });
    });
});
exports.usersRouter.delete("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});
exports.usersRouter.get("/session", (req, res) => {
    const user = req.session.user;
    if (user == null) {
        res.json(null);
        return;
    }
    res.json({ id: user.id, email: user.email });
});
