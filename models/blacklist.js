const mongoose = require("mongoose");

const blacklisted_model = new mongoose.Schema({
    users: {
        type: Array
    }
});

const blacklist = mongoose.model("blacklist", blacklisted_model);

module.exports = blacklist;
