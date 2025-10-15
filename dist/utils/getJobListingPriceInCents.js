"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobListingPriceInCents = void 0;
const assertUnreachable_1 = require("./assertUnreachable");
function getJobListingPriceInCents(duration) {
    switch (duration) {
        case 30:
            return 10000;
        case 60:
            return 17500;
        case 90:
            return 22500;
        default:
            (0, assertUnreachable_1.assertUnreachable)(duration);
    }
}
exports.getJobListingPriceInCents = getJobListingPriceInCents;
