const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const stairSchema = new Schema({
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 100 },
    height: { type: Number, default: 20 },
    img: {
        type: String,
        default:
            'https://doc-08-28-docs.googleusercontent.com/docs/securesc/ha0ro937gcuc7l7deffksulhg5h7mbp1/l73ifmq7d4jgpbl702j0rrji0q6c1b3p/1694327325000/11122670774096574549/*/1cLDjZ8r9e3P3vu0rdN2oS2m9JMbsK1YO?e=view',
    },
})

module.exports = stairSchema
