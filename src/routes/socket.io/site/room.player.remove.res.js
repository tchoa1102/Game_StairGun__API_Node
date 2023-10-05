class RoomPlayerRemoveRes {
    constructor({ player, position, newMaster }) {
        this._id = player
        this.position = position
        this.newMaster = newMaster
    }
}

module.exports = RoomPlayerRemoveRes
