"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeRouter = void 0;
const express_1 = require("express");
const stripe_1 = require("../stripe");
const config_1 = require("../config");
const stripe_2 = require("../constants/schemas/stripe");
const zParse_1 = require("../utils/zParse");
const db_1 = require("../db");
const date_fns_1 = require("date-fns");
exports.stripeRouter = (0, express_1.Router)();
exports.stripeRouter.post("/job-listing-order-complete", async (req, res) => {
    const signature = req.headers["stripe-signature"];
    console.log("Webhook request");
    if (signature == null || req.body == null) {
        res.status(400).json({ message: "No signature" });
        return;
    }
    let event;
    try {
        event = stripe_1.stripe.webhooks.constructEvent(req.body, signature, config_1.env.STRIPE_ORDER_COMPLETE_WEBHOOK_SECRET);
    }
    catch (e) {
        res.status(400).json({
            message: `Webhook Error: ${e instanceof Object && "message" in e && e.message}`,
        });
        return;
    }
    if (event.type !== "payment_intent.succeeded") {
        res.status(400).json({ message: "Invalid event type" });
        return;
    }
    const metadata = await (0, zParse_1.zParse)(event.data.object.metadata, stripe_2.jobListingOrderCompleteSchema, res);
    if (metadata == null)
        return;
    const jobListing = await db_1.db.jobListing.findUnique({
        where: { id: metadata.jobListingId },
    });
    if (jobListing == null) {
        res.status(400).json({ message: "Invalid job listing" });
        return;
    }
    const startingDate = jobListing.expiresAt == null || (0, date_fns_1.isBefore)(jobListing.expiresAt, new Date())
        ? new Date()
        : jobListing.expiresAt;
    await db_1.db.jobListing.update({
        where: { id: metadata.jobListingId },
        data: {
            expiresAt: (0, date_fns_1.addDays)(startingDate, metadata.duration),
        },
    });
    res.sendStatus(200);
});
