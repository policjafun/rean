const mongoose = require("mongoose");

const paginator_model = new mongoose.Schema({
    userId: String,
    emoji: String,
});

const paginator = mongoose.model("paginator", paginator_model);

module.exports = paginator;
