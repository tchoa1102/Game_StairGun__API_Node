export default class RoomPlayerRemoveRes {
    public _id: string
    public position: number
    public newMaster?: string
    constructor({
        player,
        position,
        newMaster,
    }: {
        player: string
        position: number
        newMaster?: string
    }) {
        this._id = player
        this.position = position
        this.newMaster = newMaster
    }
}
