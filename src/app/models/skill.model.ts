import mongoose from 'mongoose'

const SkillModel = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: Number, required: true },
    description: { type: String, default: 'Coming soon' },
    img: { type: String, required: true },
    staRequire: { type: Number, required: true },
})

export default mongoose.model('skills', SkillModel)
