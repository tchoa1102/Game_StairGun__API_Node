const { RoomModel } = require('../models')

class RoomController {
    // [GET] /api/rooms
    async getAll(req, res, next) {
        const rooms = await RoomModel.find().lean()

        if (Array.isArray(rooms)) {
            const roomsResult = rooms.reduce((total, room) => {
                let numPlayerOnRoom = 0
                room.players.forEach((p) => {
                    if (p.isOnRoom) {
                        numPlayerOnRoom += 1
                    }
                })
                room.typeMap =
                    room.typeMap.toString() === '000000000000000000000000'
                        ? 'Ngẫu nhiên'
                        : 'Tự chọn'
                if (numPlayerOnRoom > 0) {
                    total.push(room)
                }
                return total
            }, [])
            return res.json({
                data: roomsResult,
            })
        } else {
            return res.json({
                data: [],
            })
        }
    }
}

module.exports = new RoomController()
