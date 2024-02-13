const mongoose = require("mongoose");

const verifyModel = new mongoose.Schema({
    guildId: {
        type: String,
        require: true,
    },
    RoleId: {
        type: String,
    }
});

const verify = mongoose.model("verify", verifyModel);

module.exports = verify;
