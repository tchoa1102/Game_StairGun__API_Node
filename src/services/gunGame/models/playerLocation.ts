export default class playerLocationState {
    public _id: string
    public data: Array<ILocation> = []
    public isLive: boolean
    public eventKey: string
    constructor(_idPlayer: string, data: Array<ILocation>, isLive: boolean, eventKey: string) {
        this._id = _idPlayer
        this.data = data
        this.isLive = isLive
        this.eventKey = eventKey
    }
}

interface ILocation {
    x: number
    y: number
    angle: number
    time: number
}
