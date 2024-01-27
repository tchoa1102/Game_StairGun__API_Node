import mongoose from 'mongoose'

const PowerSkillModel = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, default: '' },
    srcConfig: { type: String, required: true },
})

export default mongoose.model('powerskills', PowerSkillModel)
