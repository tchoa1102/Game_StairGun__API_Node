const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cardOnStairGameSchema = Schema({
    data: { type: ObjectId, ref: 'cards' },
    x: { type: String, default: '0' },
    y: { type: String, default: '0' },
    isEnable: { type: Boolean, default: true },
})

module.exports = cardOnStairGameSchema
