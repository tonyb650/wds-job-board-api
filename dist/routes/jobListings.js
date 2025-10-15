"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobListingsRouter = void 0;
const express_1 = require("express");
const zParse_1 = require("../utils/zParse");
const db_1 = require("../db");
const jobListings_1 = require("../constants/schemas/jobListings");
const getJobListingPriceInCents_1 = require("../utils/getJobListingPriceInCents");
const stripe_1 = require("../stripe");
exports.jobListingsRouter = (0, express_1.Router)();
exports.jobListingsRouter.get("/published", async (req, res) => {
    res.json(await db_1.db.jobListing.findMany({ where: { expiresAt: { gt: new Date() } } }));
});
exports.jobListingsRouter.get("/my-listings", async (req, res) => {
    if (req.session.user?.id == null) {
        res.status(401).json({ message: "You must be logged in to do that" });
        return;
    }
    res.json(await db_1.db.jobListing.findMany({ where: { postedById: req.session.user.id } }));
});
exports.jobListingsRouter.post("/", async (req, res) => {
    if (req.session.user?.id == null) {
        res.status(401).json({ message: "You must be logged in to do that" });
        return;
    }
    const body = await (0, zParse_1.zParse)(req.body, jobListings_1.jobListingFormSchema, res);
    if (body == null)
        return;
    const jobListing = await db_1.db.jobListing.create({
        data: {
            ...body,
            postedBy: { connect: { id: req.session.user.id } },
        },
    });
    res.json(jobListing);
});
exports.jobListingsRouter.post("/:id/create-publish-payment-intent", async (req, res) => {
    if (req.session.user?.id == null) {
        res.status(401).json({ message: "You must be logged in to do that" });
        return;
    }
    const body = await (0, zParse_1.zParse)(req.body, jobListings_1.createPublishPaymentIntentSchema, res);
    if (body == null)
        return;
    const id = req.params.id;
    const jobListing = await db_1.db.jobListing.findFirst({
        where: { id, postedById: req.session.user.id },
    });
    if (jobListing == null) {
        res.status(404).json({ message: "Job listing not found" });
        return;
    }
    const paymentIntent = await stripe_1.stripe.paymentIntents.create({
        amount: (0, getJobListingPriceInCents_1.getJobListingPriceInCents)(body.duration),
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
        metadata: {
            jobListingId: req.params.id,
            duration: body.duration,
        },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
});
exports.jobListingsRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const jobListing = await db_1.db.jobListing.findUnique({ where: { id } });
    if (jobListing == null) {
        res.status(404).json({ message: "Job listing not found" });
        return;
    }
    res.json(jobListing);
});
exports.jobListingsRouter.put("/:id", async (req, res) => {
    if (req.session.user?.id == null) {
        res.status(401).json({ message: "You must be logged in to do that" });
        return;
    }
    const body = await (0, zParse_1.zParse)(req.body, jobListings_1.jobListingFormSchema, res);
    if (body == null)
        return;
    const id = req.params.id;
    const jobListing = await db_1.db.jobListing.findFirst({
        where: { id, postedById: req.session.user.id },
    });
    if (jobListing == null) {
        res.status(404).json({ message: "Job listing not found" });
        return;
    }
    const updatedJobListing = await db_1.db.jobListing.update({
        where: { id },
        data: body,
    });
    res.json(updatedJobListing);
});
exports.jobListingsRouter.delete("/:id", async (req, res) => {
    if (req.session.user?.id == null) {
        res.status(401).json({ message: "You must be logged in to do that" });
        return;
    }
    const id = req.params.id;
    const jobListing = await db_1.db.jobListing.findFirst({
        where: { id, postedById: req.session.user.id },
    });
    if (jobListing == null) {
        res.status(404).json({ message: "Job listing not found" });
        return;
    }
    await db_1.db.jobListing.delete({ where: { id } });
    res.sendStatus(204);
});
