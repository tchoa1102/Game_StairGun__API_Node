const { default: mongoose } = require('mongoose')
const { UserModel, RoomModel } = require('../../../app/models')
const RoomAddRes = require('./room.add.res')

function convertTypeMap(room) {
    return room.typeMap.toString() === '000000000000000000000000' ? 'Ngẫu nhiên' : 'Tự chọn'
}

class room {
    // #region again
    // emit: rooms/players/add/res, rooms/players/add/res/error
    async reGoIntoMatch(socket, io) {}
    // #endregion again

    // on: rooms/players/add | emit: rooms, rooms/players/add/res, rooms/players/add/res/error
    add(socket, io) {
        return async ({ idRoom }) => {
            const idPlayer = socket.handshake.idPlayer
            try {
                const room = await RoomModel.findById(idRoom)

                console.log('Go on room..., idRoom: ', idRoom, ', type room: ', room.type)
                const player = await UserModel.findById(idPlayer)
                const nowPlayerOnRoom = await RoomModel.find({
                    'players.player': socket.handshake.idPLayer,
                    'players.isOnRoom': true,
                })
                // console.log(room)
                // console.log(nowPlayerOnRoom)
                if (nowPlayerOnRoom.length > 0) {
                    socket.emit('rooms/players/add/res/error', {
                        status: 400,
                        message: 'Người chơi đã có phòng!',
                    })
                    return
                }
                if (room.type === 'Tự do') {
                    const countPlayerOnRoom = room.players.reduce((total, p) => {
                        if (p.isOnRoom) total += 1
                        return total
                    }, 0)
                    if (countPlayerOnRoom < room.maxNum) {
                        const playerOnRoom = {
                            player: idPlayer,
                            isOnRoom: true,
                            isRoomMaster: false,
                        }
                        const playerGoOnAgain = room.players.find(
                            (p) => p.player.toString() === socket.handshake.idPlayer,
                        )

                        console.log(playerGoOnAgain)
                        if (playerGoOnAgain !== undefined) {
                            playerGoOnAgain.isOnRoom = true
                        } else {
                            console.log('Room tu do...')
                            room.players.push(playerOnRoom)
                        }
                        await room.save()

                        room._doc.typeMap = convertTypeMap(room)
                        socket.join(room._id)
                        io.to(room._id).emit('rooms/players/add/res', {
                            data: new RoomAddRes({
                                ...playerOnRoom,
                                player: player,
                            }),
                        })
                        io.emit('rooms', {
                            type: 'update',
                            data: room,
                        })
                        return
                    }

                    return socket.emit('rooms/players/add/res/error', {
                        status: 400,
                        message: 'Vào phòng thất bại!',
                    })
                }
            } catch (error) {
                console.log(error)
                socket.emit('rooms/players/add/res/error', {
                    status: 400,
                    message: 'Phòng không tồn tại!',
                })
                return
            }
            return
        }
    }

    // on: rooms/create | emit: rooms, rooms/players/add/res, rooms/players/add/res/error
    create(socket, io) {
        return async () => {
            const idPlayer = socket.handshake.idPlayer
            // const player = await UserModel.findById(idPlayer)
            const nowPlayerOnRoom = await RoomModel.find({
                'players.player': socket.handshake.idPlayer,
                'players.isOnRoom': true,
            })

            if (nowPlayerOnRoom.length > 0) {
                socket.emit('rooms/players/add/res/error', {
                    status: 400,
                    message: 'Người chơi đã có phòng!',
                })
                return
            } else {
                console.log('create player')
                try {
                    const player = await UserModel.findById(idPlayer)
                    const playerOnRoom = {
                        player: idPlayer,
                        isOnRoom: true,
                        isRoomMaster: true,
                    }
                    const room = new RoomModel()
                    room.players.push(playerOnRoom)

                    await room.save()
                    socket.join(room._id.toString())
                    room._doc.typeMap = convertTypeMap(room)

                    io.emit('rooms', { type: 'create', data: room })

                    const currentRoom = { ...room.toObject(), chatRoom: [] }
                    // console.log(currentRoom)
                    currentRoom.players[0].player = { ...player.toObject() }
                    socket.emit('rooms/players/add/res', {
                        data: currentRoom,
                    })
                } catch (error) {
                    console.log('create room: ', error)
                    socket.emit('rooms/players/add/error', {
                        status: 400,
                        message: 'Người chơi không hợp lệ!',
                    })
                }
                return
            }
        }
    }

    goOut(socket, io) {
        return async () => {
            const idPlayer = socket.handshake.idPlayer
            const rooms = await RoomModel.find({
                'players.player': socket.handshake.idPlayer,
                'players.isOnRoom': true,
            }).lean()

            for (const room of rooms) {
                room.players.forEach((p) => {
                    if (p.player.toString() === idPlayer) {
                        p.isOnRoom = false
                        if (p.isRoomMaster) {
                            p.isRoomMaster = false
                            const otherP = room.players.find(
                                (p) => p.isOnRoom && p.player.toString() !== idPlayer,
                            )

                            if (otherP) {
                                room.players[otherP].isRoomMaster = true
                            }
                        }
                    }
                })

                // console.log(room)
                await RoomModel.updateOne({ _id: room._id }, room)
                room.typeMap = convertTypeMap(room)
            }
            console.log(rooms[rooms.length - 1])

            io.emit('rooms', { type: 'update', data: rooms[rooms.length - 1] })
            socket.emit('rooms/players/goOut/res')
        }
    }
}

module.exports = new room()
