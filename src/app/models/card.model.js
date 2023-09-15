const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CardModel = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
})

module.exports = mongoose.model('cards', CardModel)
