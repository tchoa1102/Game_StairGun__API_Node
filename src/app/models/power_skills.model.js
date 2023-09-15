const mongoose = require('mongoose')

const PowerSkillModel = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, default: '' },
    srcConfig: { type: String, required: true },
})

module.exports = mongoose.model('powerskills', PowerSkillModel)
