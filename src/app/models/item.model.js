const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId
const newObjectId = mongoose.Types.ObjectId

const { propertySchema } = require('../schemas')

const ItemModel = mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    canWear: { type: Boolean, default: false },
    srcConfig: { type: String, required: true },
    hasPowerSkill: {
        type: ObjectId,
        ref: 'powerskills',
        default: newObjectId('000000000000000000000000'),
    },
    property: [propertySchema],
})
