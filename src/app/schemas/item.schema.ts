import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const newObjectId = mongoose.Types.ObjectId

class Item {
    public _id: mongoose.Types.ObjectId
    public data: any
    public isWear: boolean
    public levelUp: number = 0

    constructor(data?: any, isWear?: any, levelUp?: any) {
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
        ref: 'items',
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

export default itemSchema
export { Item }
