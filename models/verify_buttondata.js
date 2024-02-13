const mongoose = require("mongoose");

const verifyModel = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    label :{
        type: String,
        default: "verify"
    },
    style: { 
        type: String,
        default: "PRIMARY"
    },
    emoji: {
        type: String,
    }
});

const verify_buttondata = mongoose.model("verifybutton", verifyModel);

module.exports = verify_buttondata;
