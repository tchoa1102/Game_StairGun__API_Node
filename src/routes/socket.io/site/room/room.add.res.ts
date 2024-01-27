export default class RoomAddRes {
    public _id: string | undefined
    public type: string | undefined
    public typeMap: string
    public maxNum: number | undefined
    public chatRoom: Array<any>
    public players: Array<any>
    constructor({
        _id,
        type,
        typeMap,
        players,
        maxNum,
    }: {
        _id?: string
        type?: string
        typeMap?: any
        players?: Array<any>
        maxNum?: number
    }) {
        this._id = _id
        this.type = type
        this.typeMap = typeMap.toString() === '000000000000000000000000' ? 'Ngẫu nhiên' : 'Tự chọn'
        this.maxNum = maxNum
        this.chatRoom = []
        this.players = []
        players?.forEach((data) => {
            if (typeof data.player === 'object') {
                this.players.push({ ...data, player: { ...data.player } })
            } else {
                this.players.push({ ...data })
            }
        })
    }
}
