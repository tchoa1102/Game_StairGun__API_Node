const mongoose = require('mongoose')

const CharacterModel = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: 'Coming soon' },
    srcConfig: { type: String, required: true },
})

module.exports = new mongoose.model('characters', CharacterModel)
