"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const users_1 = require("./routes/users");
const jobListings_1 = require("./routes/jobListings");
const config_1 = require("./config");
const session_1 = require("./setup/session");
const cors_1 = require("./setup/cors");
const stripe_1 = require("./routes/stripe");
const app = (0, express_1.default)();
(0, session_1.setupSession)(app);
(0, cors_1.setupCors)(app);
app.use("/stripe-webhooks", express_1.default.raw({ type: "*/*" }), stripe_1.stripeRouter);
app.use(express_1.default.json());
// Routes
app.use("/users", users_1.usersRouter);
app.use("/job-listings", jobListings_1.jobListingsRouter);
app.listen(config_1.env.PORT, () => {
    console.log(`Server listening at port ${config_1.env.PORT}`);
});
