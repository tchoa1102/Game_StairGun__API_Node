import { Schema, model, Types } from 'mongoose'
import { propertySchema } from '../schemas'
import { IItem } from '../typeModels'

const ObjectId = Schema.ObjectId
const newObjectId = Types.ObjectId

const ItemSchema = new Schema<IItem>({
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

export default model('items', ItemSchema)

/**
 * config animation use public
 *
 */
