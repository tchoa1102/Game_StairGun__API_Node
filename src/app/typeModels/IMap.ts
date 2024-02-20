import { Types } from 'mongoose'
import { ILocation } from '../../shares/interfaces'

export default interface IMap {
    name: string
    type: string
    objects: Array<{ location: ILocation; data: Types.ObjectId }>
    playersLocations: ILocation
    backgroundGunGame: string
}
