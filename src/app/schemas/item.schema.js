const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const newObjectId = mongoose.Types.ObjectId

const itemSchema = new Schema({
    from: {
        type: String,
        required: true,
    },
    data: {
        type: ObjectId,
        default: new newObjectId('000000000000000000000000'),
    },
    isWear: {
        type: Boolean,
        default: false,
    },
    levelUp: {
        type: Number,
        default: 0,
    },
})

module.exports = itemSchema
