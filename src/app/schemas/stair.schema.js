const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const stairSchema = Schema({
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 100 },
    height: { type: Number, default: 10 },
    img: {
        type: String,
        default:
            'https://drive.google.com/file/d/1cLDjZ8r9e3P3vu0rdN2oS2m9JMbsK1YO/view?usp=drive_link',
    },
})

module.exports = stairSchema
