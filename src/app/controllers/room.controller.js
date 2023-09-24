const { RoomModel } = require('../models')

class RoomController {
    // [GET] /api/rooms
    async getAll(req, res, next) {
        const rooms = await RoomModel.find().lean()

        if (Array.isArray(rooms)) {
            rooms.forEach((room) => {
                room.typeMap =
                    room.typeMap.toString() === '000000000000000000000000'
                        ? 'Ngẫu nhiên'
                        : 'Tự chọn'
            })
        }

        return res.json({
            data: rooms,
        })
    }
}

module.exports = new RoomController()
