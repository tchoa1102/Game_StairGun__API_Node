export default class CollisionCardRes {
    public time: number
    public owner: string
    public _id: string
    public card: any
    constructor(time: number, owner: string, cardOnMatchId: string, card: any) {
        this.time = time
        this.owner = owner
        this._id = cardOnMatchId
        this.card = { ...card }
    }
}
