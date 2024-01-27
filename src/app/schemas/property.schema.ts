import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema({
    value: { type: Number, required: true },
    type: { type: String, required: true }, // hp/sta/atk/def/luk/agi
})

export default propertySchema
