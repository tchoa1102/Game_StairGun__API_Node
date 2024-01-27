export default class StickEventRes {
    public _id: string
    public event: any
    public x: number
    public y: number
    constructor(_id: string, event: any, x: number, y: number, specialEvent?: any) {
        this._id = _id
        this.event = event
        this.x = x
        this.y = y
    }
}
