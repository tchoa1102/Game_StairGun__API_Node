const mongoose = require('mongoose')

const SkillModel = mongoose.Schema({
    name: { type: String, required: true },
    location: { type: Number, required: true },
    description: { type: String, default: 'Coming soon' },
    img: { type: String, required: true },
    staRequire: { type: Number, required: true },
})
