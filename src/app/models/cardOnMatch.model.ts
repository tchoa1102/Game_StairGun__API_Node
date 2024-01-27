import mongoose from 'mongoose'
const Schema = mongoose.Schema

const CardOnMatchModel = new Schema({
    match: { type: Schema.ObjectId, required: true },
    data: { type: Schema.ObjectId, ref: 'cards' },
    x: { type: String, default: '0' },
    y: { type: String, default: '0' },
    isEnable: { type: Boolean, default: true },
    pickUpTime: { type: String, default: new Date().toISOString() },
    owner: { type: Schema.ObjectId, default: null },
})

export default mongoose.model('cardonmatches', CardOnMatchModel)
