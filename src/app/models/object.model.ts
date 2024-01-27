import mongoose from 'mongoose'

const ObjectModel = new mongoose.Schema(
    {
        name: { type: String, required: true },
        points: [{ x: Number, y: Number }],
        src: { type: String, required: true },
        canBeDestroyed: { type: Boolean, required: false },
    },
    {
        timestamps: true,
    },
)

export default mongoose.model('objects', ObjectModel)
