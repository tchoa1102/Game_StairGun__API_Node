class RoomAddRes {
    constructor({ isOnRoom, isRoomMaster, player }) {
        this.isOnRoom = isOnRoom
        this.isRoomMaster = isRoomMaster
        this.player = player
    }
}

module.exports = RoomAddRes
