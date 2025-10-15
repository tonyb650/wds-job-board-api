"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPublishPaymentIntentSchema = exports.jobListingFormSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const types_1 = require("../types");
const zodCreateUnionSchema_1 = require("../../lib/zodCreateUnionSchema");
exports.jobListingFormSchema = zod_1.default.object({
    title: zod_1.default.string().nonempty(),
    companyName: zod_1.default.string().nonempty(),
    location: zod_1.default.string().nonempty(),
    applyUrl: zod_1.default.string().url().nonempty(),
    type: zod_1.default.enum(types_1.JOB_LISTING_TYPES),
    experienceLevel: zod_1.default.enum(types_1.JOB_LISTING_EXPERIENCE_LEVELS),
    salary: zod_1.default.number().int().positive(),
    shortDescription: zod_1.default.string().max(200).nonempty(),
    description: zod_1.default.string().nonempty(),
});
exports.createPublishPaymentIntentSchema = zod_1.default.object({
    duration: (0, zodCreateUnionSchema_1.createUnionSchema)(types_1.JOB_LISTING_DURATIONS),
});
