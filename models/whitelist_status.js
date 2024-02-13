const mongoose = require("mongoose");

const whitelistStatusSchema = new mongoose.Schema({
    Enabled: {
        type: Boolean,
        default: true,
    },
});

const WhitelistStatus = mongoose.model(
    "WhitelistStatus",
    whitelistStatusSchema
);

module.exports = WhitelistStatus;
