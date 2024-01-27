import mongoose from 'mongoose'
const Schema = mongoose.Schema

const CardModel = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    src: { type: String, required: true },
    match: { type: String, required: true },
})

export default mongoose.model('cards', CardModel)
