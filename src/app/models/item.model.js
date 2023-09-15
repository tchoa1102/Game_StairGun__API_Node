const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId
const newObjectId = mongoose.Types.ObjectId

const { propertySchema } = require('../schemas')

const ItemModel = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    canWear: { type: Boolean, default: false },
    srcConfig: { type: String, required: true },
    hasPowerSkill: {
        type: ObjectId,
        ref: 'powerskills',
        default: new newObjectId('000000000000000000000000'),
    },
    property: [propertySchema],
})

module.exports = mongoose.model('items', ItemModel)
