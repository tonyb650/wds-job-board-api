"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobListingOrderCompleteSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const zodCreateUnionSchema_1 = require("../../lib/zodCreateUnionSchema");
const types_1 = require("../types");
exports.jobListingOrderCompleteSchema = zod_1.default.object({
    duration: zod_1.default.coerce.number((0, zodCreateUnionSchema_1.createUnionSchema)(types_1.JOB_LISTING_DURATIONS)),
    jobListingId: zod_1.default.string(),
});
