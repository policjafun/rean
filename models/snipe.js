const mongoose = require('mongoose')

module.exports = mongoose.model('snipe', new mongoose.Schema({
    id: String,
    user: String,
    message: String,
    channel: String,
}))