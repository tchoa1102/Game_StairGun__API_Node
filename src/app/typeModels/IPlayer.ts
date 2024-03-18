import mongoose from 'mongoose'
import { Item } from '../schemas/item.schema'

export default interface IPlayer {
    _id: mongoose.Types.ObjectId
    uid: string //idFBase
    socketId: string
    clientId: string
    name: string
    email: string
    picture: string
    level: number
    HP: number // health point
    STA: number // stamina point
    ATK: number // attack point
    DEF: number // defense point
    LUK: number // lucky point
    AGI: number // agility point

    gold: number

    character: mongoose.Types.ObjectId
    skills: Array<any>
    looks: {
        face: string
        body: string
        foot: string
        weapon: string
    }
    bag: Array<Item>
}
