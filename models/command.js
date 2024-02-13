const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const command = new Schema({
    id: String,
    commands: Array
});

module.exports = mongoose.model(`command`, command);