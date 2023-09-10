const mongoose = require('mongoose')

const MapModel = mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    canBeDestroyed: { type: Boolean, required: true },
    srcConfig: { type: String, required: true },
})
