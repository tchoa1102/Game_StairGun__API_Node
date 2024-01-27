export default class RoomRes {
    public _id: string
    public player: {
        _id: string
        isOnRoom: boolean
        isRoomMaster: boolean
        isReady: boolean
        position: number
    }
    constructor({ _id, player }: { _id: string; player: any }) {
        this._id = _id
        this.player = {
            _id: player._id,
            isOnRoom: player.isOnRoom,
            isRoomMaster: player.isRoomMaster,
            isReady: player.isReady,
            position: player.position,
        }
    }
}
