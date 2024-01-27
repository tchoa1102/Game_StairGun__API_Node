import mongoose from 'mongoose'
const Schema = mongoose.Schema

const StateEffectModel = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    img: { type: String, required: true },
})

export default mongoose.model('stateeffects', StateEffectModel)
