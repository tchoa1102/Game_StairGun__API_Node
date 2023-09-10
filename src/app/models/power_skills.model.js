const mongoose = require('mongoose')

const PowerSkillModel = mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, default: '' },
    srcConfig: { type: String, required: true },
})
