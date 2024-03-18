import mongoose from 'mongoose'
import { ILocation } from '../../shares/interfaces'

// const ObjectModel = new mongoose.Schema(
//     {
//         name: { type: String, required: true },
//         points: [{ x: Number, y: Number }],
//         src: { type: String, required: true },
//         canBeDestroyed: { type: Boolean, required: false },
//     },
//     {
//         timestamps: true,
//     },
// )

export default interface IObject {
    name: string
    points: Array<ILocation>
    src: string
    canBeDestroyed: boolean
}
