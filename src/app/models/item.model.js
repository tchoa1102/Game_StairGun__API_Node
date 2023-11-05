const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId
const newObjectId = mongoose.Types.ObjectId

const { propertySchema } = require('../schemas')

const ItemModel = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }, // face, body, foot, weapon
    canWear: { type: Boolean, default: false },
    imgItem: { type: String, required: true },
    texture: { type: String, required: true }, 
    hasPowerSkill: {
        type: ObjectId,
        ref: 'powerskills',
        default: new newObjectId('000000000000000000000000'),
    },
    description: { type: String, default: '' },
    properties: [propertySchema],
    price: { type: Number, default: 0 },
    isSale: { type: Boolean, default: true },
})

module.exports = mongoose.model('items', ItemModel)

/**
 * config animation use public
 * 
 */
