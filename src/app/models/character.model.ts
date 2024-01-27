import mongoose from 'mongoose'

const CharacterModel = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: 'Coming soon' },
    srcConfig: { type: String, required: true },
})

export default mongoose.model('characters', CharacterModel)
