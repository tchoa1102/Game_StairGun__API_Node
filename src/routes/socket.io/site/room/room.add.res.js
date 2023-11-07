class RoomAddRes {
    constructor({ _id, type, typeMap, players, maxNum }) {
        this._id = _id
        this.type = type
        this.typeMap = typeMap.toString() === '000000000000000000000000' ? 'Ngẫu nhiên' : 'Tự chọn'
        this.maxNum = maxNum
        this.chatRoom = []
        this.players = []
        players.forEach((data) => {
            if (typeof data.player === 'object') {
                this.players.push({ ...data, player: { ...data.player } })
            } else {
                this.players.push({ ...data })
            }
        })
    }
}

module.exports = RoomAddRes
