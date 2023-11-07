const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const newObjectId = mongoose.Types.ObjectId

class Item {
    constructor(data, isWear, levelUp) {
        this._id = new newObjectId()
        this.data = data || new newObjectId('000000000000000000000000')
        this.isWear = isWear || false
        this.levelUp = levelUp || 0
    }
}

const itemSchema = new Schema({
    data: {
        type: ObjectId,
        default: new newObjectId('000000000000000000000000'),
        ref: 'items'
    },
    isWear: {
        type: Boolean,
        default: false,
    },
    levelUp: {
        type: Number,
        default: 0,
    },
})

module.exports = {
    itemSchema,
    Item
}
