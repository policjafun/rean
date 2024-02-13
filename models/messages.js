const mongoose = require("mongoose");

const message_model = new mongoose.Schema({
    userId: String,
    messageCount: Number
});

const messagemodel = mongoose.model("messagemodel", message_model);

module.exports = messagemodel;
