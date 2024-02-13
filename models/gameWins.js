const mongoose = require("mongoose");

const gameWins = new mongoose.Schema({
    userID: String,
    wins: Number,

});

const gameWin = mongoose.model("gameWins", gameWins);

module.exports = gameWin;
