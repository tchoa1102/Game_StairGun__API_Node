import mongoose from 'mongoose'
const Schema = mongoose.Schema

const cardOnStairGameSchema = new Schema({
    data: { type: Schema.ObjectId, ref: 'cards' },
    x: { type: String, default: '0' },
    y: { type: String, default: '0' },
    isEnable: { type: Boolean, default: true },
    owner: { type: Schema.ObjectId, default: null },
})

export default cardOnStairGameSchema
