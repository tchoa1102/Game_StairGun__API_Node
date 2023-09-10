const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const newObjectId = mongoose.Types.ObjectId
const levelUpSchema = require('./levelUp.schema')

const bagSchema = Schema({
    from: {
        type: String,
        required: true,
    },
    data: {
        type: ObjectId,
        default: newObjectId('000000000000000000000000'),
    },
    isWear: {
        type: Boolean,
        default: false,
    },
    levelUp: levelUpSchema,
})

module.exports = bagSchema
