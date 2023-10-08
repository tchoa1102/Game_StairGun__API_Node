const { default: mongoose } = require('mongoose')
const { UserModel, RoomModel } = require('../../../app/models')
const RoomAddRes = require('./room.add.res')
const RoomPlayerRemoveRes = require('./room.player.remove.res')
const RoomRes = require('./room.res')

class room {
    // #region again
    // emit: rooms/players/add/res, res/error
    async reGoIntoMatch(socket, io) {}
    // #endregion again

    // on: rooms/players/ready | emit: rooms/players/ready/res, res/error
    ready(socket, io) {
        return async ({ idRoom, isReady }) => {
            const idPlayer = socket.handshake.idPlayer
            try {
                const room = await RoomModel.findById(idRoom).lean()

                if (!room) {
                    socket.emit('res/error', { status: 404 })
                    return
                }
                let player = {}
                room.players.forEach((p) => {
                    if (p.player.toString() === idPlayer) {
                        p.isReady = isReady
                        Object.assign(player, p)
                    }
                })
                await RoomModel.updateOne({ _id: room._id }, room)
                io.to(idRoom).emit(
                    'rooms/players/ready/res',
                    new RoomRes({
                        _id: idRoom,
                        player: {
                            ...player,
                            _id: idPlayer,
                            isReady: isReady,
                        },
                    }),
                )
            } catch (error) {
                console.log(error)
                socket.emit('res/error', { status: 500 })
            }
        }
    }

    // on: rooms/players/add | emit: rooms, rooms/players/add/res, res/error
    add(socket, io) {
        return async ({ idRoom }) => {
            const idPlayer = socket.handshake.idPlayer
            try {
                const room = await RoomModel.findById(idRoom)

                console.log(
                    'Go on room..., idRoom: ',
                    idRoom,
                    ', type room: ',
                    room.type,
                    ', player: ' + idPlayer,
                )
                const nowPlayerOnRoom = await RoomModel.find({
                    'players.player': socket.handshake.idPLayer,
                    'players.isOnRoom': true,
                })
                if (nowPlayerOnRoom.length > 0) {
                    socket.emit('res/error', {
                        status: 400,
                        message: 'Người chơi đã có phòng!',
                    })
                    return
                }
                if (room.type === 'Tự do') {
                    let newPosition = 0
                    const countPlayerOnRoom = room.players.reduce((total, p) => {
                        if (newPosition === p.position && p.isOnRoom) newPosition += 1
                        if (p.isOnRoom) total += 1
                        return total
                    }, 0)
                    if (countPlayerOnRoom < room.maxNum) {
                        const playerGoOnAgain = room.players.find(
                            (p) => p.player.toString() === socket.handshake.idPlayer,
                        )

                        if (playerGoOnAgain !== undefined) {
                            playerGoOnAgain.isOnRoom = true
                            playerGoOnAgain.position = newPosition
                        } else {
                            // console.log('Room tu do...')
                            const playerOnRoom = {
                                player: idPlayer,
                                position: newPosition,
                            }
                            room.players.push(playerOnRoom)
                        }
                        await room.save()

                        // console.log(room.players)
                        socket.join(room._id.toString())

                        const r = room.toObject()
                        const playersOnRoom = []
                        for (const p of r.players) {
                            if (p.isOnRoom) {
                                const player = await UserModel.findById(p.player).lean()
                                p.player = player
                                playersOnRoom.push(p)
                            }
                        }
                        r.players = playersOnRoom

                        io.to(room._id.toString()).emit('rooms/players/add/res', {
                            data: new RoomAddRes(r),
                        })
                        io.emit('rooms', {
                            type: 'update',
                            data: room,
                        })
                        return
                    }

                    return socket.emit('res/error', {
                        status: 400,
                        message: 'Vào phòng thất bại!',
                    })
                }
            } catch (error) {
                console.log(error)
                socket.emit('res/error', {
                    status: 400,
                    message: 'Phòng không tồn tại!',
                })
                return
            }
            return
        }
    }

    // on: rooms/create | emit: rooms, rooms/players/add/res, res/error
    create(socket, io) {
        return async () => {
            const idPlayer = socket.handshake.idPlayer
            console.log('Create room from request of: ' + idPlayer)
            // const player = await UserModel.findById(idPlayer)
            const nowPlayerOnRoom = await RoomModel.find({
                'players.player': socket.handshake.idPlayer,
                'players.isOnRoom': true,
            })

            if (nowPlayerOnRoom.length > 0) {
                socket.emit('res/error', {
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
                        isRoomMaster: true,
                        position: 0,
                    }
                    const room = new RoomModel()
                    room.players.push(playerOnRoom)

                    await room.save()
                    const r = room.toObject()
                    socket.join(r._id.toString())

                    io.emit('rooms', { type: 'create', data: new RoomAddRes(r) })

                    r.players[0].player = { ...player.toObject() }
                    socket.emit('rooms/players/add/res', {
                        data: new RoomAddRes(r),
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

    // on: rooms/players/goOut | emit: rooms, rooms/players/goOut/res, rooms/players/remove/res,
    goOut(socket, io) {
        return async () => {
            const idPlayer = socket.handshake.idPlayer
            const rooms = await RoomModel.find({
                'players.player': socket.handshake.idPlayer,
                'players.isOnRoom': true,
            }).lean()
            console.log('Go out: ' + socket.handshake.idPlayer)

            for (const room of rooms) {
                room.players.forEach((p) => {
                    if (p.player.toString() === idPlayer) {
                        p.isOnRoom = false
                        let newMaster = undefined
                        if (p.isRoomMaster) {
                            p.isRoomMaster = false
                            const otherP = room.players.find(
                                (p) => p.isOnRoom && p.player.toString() !== idPlayer,
                            )

                            if (otherP) {
                                otherP.isRoomMaster = true
                                newMaster = otherP.player
                            }
                        }
                        console.log('emit ', room._id.toString())
                        socket.to(room._id.toString()).emit('rooms/players/remove/res', {
                            data: new RoomPlayerRemoveRes({
                                player: idPlayer,
                                position: p.position,
                                newMaster,
                            }),
                        })
                    }
                })

                socket.leave(room._id.toString())
                // console.log(room)
                await RoomModel.updateOne({ _id: room._id }, room)
                io.emit('rooms', { type: 'update', data: new RoomAddRes(room) })
            }
            // console.log(rooms[rooms.length - 1])

            socket.emit('rooms/players/goOut/res')
        }
    }
}

module.exports = new room()
