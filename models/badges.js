const mongoose = require("mongoose");

const badges = new mongoose.Schema({
    userID: String,
    badges: Array,
});

const badge = mongoose.model("badge", badges);

module.exports = badge;
