const mongoose = require('mongoose')

const ObjectModel = new mongoose.Schema(
    {
        name: { type: String, required: true },
        points: [{ x: String, y: String }],
        src: { type: String, required: true },
        canBeDestroyed: { type: Boolean, required: true },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('objects', ObjectModel)
