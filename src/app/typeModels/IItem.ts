import { Types } from 'mongoose'
import { propertySchema } from '../schemas'

export default interface IItem {
    name: string
    type: string
    canWear: boolean
    imgItem: string
    texture: string
    hasPowerSkill: Types.ObjectId
    description: string
    properties: Array<typeof propertySchema>
    price: number
    isSale: boolean
}
