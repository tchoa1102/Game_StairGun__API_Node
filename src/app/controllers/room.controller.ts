import { RoomModel } from '../models'

class RoomController {
    // [GET] /api/rooms
    async getAll(req: any, res: any, next: any) {
        const rooms = await RoomModel.find().lean()

        if (Array.isArray(rooms)) {
            const roomsResult = rooms.reduce((total: Array<any>, room: any) => {
                let numPlayerOnRoom = 0
                room.players.forEach((p: any) => {
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

export default new RoomController()
