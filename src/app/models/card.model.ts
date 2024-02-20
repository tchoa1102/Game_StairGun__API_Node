import { Schema, model, models } from 'mongoose'
import { ICard } from '../typeModels'

const CardSchema = new Schema<ICard>({
    name: { type: String, required: true },
    type: { type: String, required: true },
    src: { type: String, required: true },
    match: { type: String, required: true },
})

export default model('cards', CardSchema)
