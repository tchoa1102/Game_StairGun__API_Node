import {
    UserModel,
    RoomModel,
    CharacterModel,
    MatchModel,
    MapModel,
    PlayerOnMatchModel,
} from '../../../../app/models'
import RoomAddRes from './room.add.res'
import RoomPlayerRemoveRes from './room.player.remove.res'
import RoomRes from './room.res'
import config from '../../../../gameConfig.json'

import { createStairs, startNewTurn } from '../../../../shares'
import MatchRes from '../match/match.res'
import cardController from '../../../../app/controllers/card.controller'
import Turn from '../../../../shares/turn'

class room {
    // #region again
    // emit: rooms/players/add/res, res/error
    async reGoIntoMatch(socket: any, io: any) {}
    // #endregion again

    // on: rooms/players/change-position | emit: res/error, rooms/players/change-position/res
    changePosition(socket: any, io: any) {
        return async ({ idRoom, position }: { idRoom: any; position: any }) => {
            const idPlayer = socket.handshake.idPlayer
            try {
                const room = await RoomModel.findById(idRoom).lean()
                if (!room) {
                    return socket.emit('res/error', { status: 404, message: 'Room not found!' })
                }

                let playerIndex = -1
                const isPositionNoEmpty = room.players.some((p, index) => {
                    if (p.player.toString() === idPlayer) playerIndex = index
                    return p.isOnRoom && p.position === position
                })
                if (isPositionNoEmpty || playerIndex === -1) {
                    return socket.emit('res/error', {
                        status: 404,
                        message: 'Position is not empty!',
                    })
                }

                room.players[playerIndex].position = position
                await RoomModel.updateOne({ _id: room._id }, room)

                return io.to(idRoom).emit('rooms/players/change-position/res', {
                    player: idPlayer,
                    position: position,
                })
            } catch (error) {
                console.log(error)
                return socket.emit('res/error', { status: 500 })
            }
        }
    }

    // on: rooms/players/ready | emit: matches/create/res, rooms/players/ready/res, res/error
    ready(socket: any, io: any) {
        return async ({ idRoom, isReady }: { idRoom: any; isReady: any }) => {
            const idPlayer = socket.handshake.idPlayer
            try {
                const room = await RoomModel.findById(idRoom).lean()

                if (!room) {
                    socket.emit('res/error', { status: 404 })
                    return
                }
                let player = {}
                const teamA = []
                const teamB = []
                room.players.forEach((p) => {
                    if (p.player.toString() === idPlayer) {
                        p.isReady = isReady
                        Object.assign(player, p)
                    }

                    if (p.isOnRoom && p.isReady) {
                        if (p.position < 3) {
                            teamA.push(p.position)
                        } else {
                            teamB.push(p.position)
                        }
                    }
                })

                // console.log(room.players)

                await RoomModel.updateOne({ _id: room._id }, room)
                if (teamA.length !== teamB.length) {
                    return io.to(idRoom).emit(
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
                } else {
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
                }
                if (teamA.length > 0 && teamA.length === teamB.length) {
                    const listStair = createStairs()
                    // console.log(listStair)
                    const characters = await CharacterModel.find({
                        name: /stick-/,
                    })
                    const maps = await MapModel.find()
                    const mapChosenIndex = Math.floor(Math.random() * maps.length)
                    const map: any = await maps[mapChosenIndex].populate('objects.data')
                    // console.log('\n\nMap: ', map)
                    const configCircleStick = characters[0].srcConfig

                    const timeStart = new Date().toISOString()

                    const newMatch: any = new MatchModel({
                        timeStart,
                        curTiled: '',
                        stairs: listStair,
                        map: map._id,
                    })

                    const cardsData = await cardController.createListCards(newMatch._id, listStair)
                    const cards = cardsData.cards

                    // #region convert players
                    const players: any[] = []
                    for (const p of room.players) {
                        if (p.isOnRoom) {
                            const dataPlayer: any = await UserModel.findById(p.player).lean()
                            const indexStair = Math.floor(Math.random() * listStair.length)
                            const indexLocationOnMap = Math.floor(
                                Math.random() * map.playersLocations.length,
                            )
                            const player = {
                                match: newMatch._id,
                                target: dataPlayer,
                                position: p.position,
                                mainGame: {
                                    bottomLeft: {
                                        ...map.playersLocations[indexLocationOnMap].toObject(),
                                    },
                                    characterGradient: 90,
                                    HP: Number.parseFloat(dataPlayer.HP),
                                    STA: Number.parseFloat(dataPlayer.STA),
                                    ATK: Number.parseFloat(dataPlayer.ATK),
                                    DEF: Number.parseFloat(dataPlayer.DEF),
                                    LUK: Number.parseFloat(dataPlayer.LUK),
                                    AGI: Number.parseFloat(dataPlayer.AGI),
                                    skillsUsing: [],
                                    cardsUsing: [],
                                    stateEffects: [],
                                },
                                stairGame: {
                                    x:
                                        listStair[indexStair].x +
                                        Math.random() * listStair[indexStair].width,
                                    y: listStair[indexStair].y,
                                    vx: 0,
                                    vy: 0,
                                },
                            }

                            const pl = new PlayerOnMatchModel(player)
                            await pl.save()
                            players.push(player)
                        }
                    }
                    // #endregion convert players
                    const turner = players[0].target._id
                    const logs: any[] = []
                    const matchConfig = {
                        match: newMatch._id,
                        map: map._id,

                        logs,
                        stairs: listStair,
                        cards: cardsData.cardsDetail,
                        timeStart: timeStart,
                        players: players.map((p) => p.target),
                        player: players[0],
                        objects: map.objects,
                        endEventTime: Math.abs(new Date().getTime() - new Date(0).getTime()),
                    }
                    const t = setTimeout(
                        (_this, match) => {
                            console.log('\nTimeout begin\n')
                            startNewTurn(_this, match)
                        },
                        20000,
                        {
                            io,
                            socket,
                            _id: turner,
                            baseUrl: 'gun-game',
                        },
                        matchConfig,
                    )
                    const turnConfig = new Turn(0, t, turner)
                    logs.push(turnConfig)
                    players.forEach((player) => {
                        const dataSaveSocket = {
                            _id: newMatch._id,
                            match: newMatch._id,
                            map: map._id,

                            logs,
                            stairs: listStair,
                            cards: cardsData.cardsDetail,
                            timeStart: timeStart,
                            players: players.map((p) => p.target),
                            player,
                            objects: map.objects,
                            eventState: undefined,
                            endEventTime: Math.abs(new Date().getTime() - new Date(0).getTime()),
                        }
                        io.sockets.sockets.get(player.target.socketId).handshake.match =
                            dataSaveSocket
                        // console.log('data day: ', socket.handshake.match.player)
                    })

                    await newMatch.save()
                    // console.log('Create match: ', newMatch)

                    const dataMatchRes = {
                        ...newMatch.toObject(),
                        players: players.map((p) => ({
                            ...p,
                            target: p.target,
                        })),
                        cards,
                    }

                    const dataRes: any = new MatchRes(
                        dataMatchRes,
                        configCircleStick,
                        map.objects,
                        map.backgroundGunGame,
                    )
                    dataRes.turner = turner
                    dataRes.windForce = turnConfig.windForce
                    // console.log(dataRes)
                    return io.to(idRoom).emit('matches/create/res', {
                        data: dataRes,
                    })
                }
            } catch (error) {
                console.log(error)
                socket.emit('res/error', { status: 500 })
            }
        }
    }

    // on: rooms/players/add | emit: rooms, rooms/players/add/res, res/error
    add(socket: any, io: any) {
        return async ({ idRoom }: { idRoom: string }) => {
            const idPlayer = socket.handshake.idPlayer
            try {
                const room: any = await RoomModel.findById(idRoom)

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
                    const countPlayerOnRoom = room.players.reduce((total: number, p: any) => {
                        if (newPosition === p.position && p.isOnRoom) newPosition += 1
                        if (p.isOnRoom) total += 1
                        return total
                    }, 0)
                    if (countPlayerOnRoom < room.maxNum) {
                        const playerGoOnAgain = room.players.find(
                            (p: any) => p.player.toString() === socket.handshake.idPlayer,
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
                        socket.handshake.idRoom = room._id.toString()

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
    create(socket: any, io: any) {
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
                    const player: any = await UserModel.findById(idPlayer)
                    const playerOnRoom = {
                        player: idPlayer,
                        isRoomMaster: true,
                        position: 0,
                    }
                    const room = new RoomModel()
                    room.players.push(playerOnRoom)

                    await room.save()
                    const r: any = room.toObject()
                    socket.join(r._id.toString())
                    socket.handshake.idRoom = r._id.toString()

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
    goOut(socket: any, io: any) {
        return async () => {
            const idPlayer = socket.handshake.idPlayer
            const rooms = await RoomModel.find({
                'players.player': socket.handshake.idPlayer,
                'players.isOnRoom': true,
            }).lean()
            console.log('Go out: ' + socket.handshake.idPlayer)

            for (const r of rooms) {
                const room: any = r
                room.players.forEach((p: any) => {
                    if (p.player.toString() === idPlayer) {
                        p.isOnRoom = false
                        let newMaster: any = undefined
                        if (p.isRoomMaster) {
                            p.isRoomMaster = false
                            const otherP = room.players.find(
                                (p: any) => p.isOnRoom && p.player.toString() !== idPlayer,
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
                socket.handshake.idRoom = undefined
                // console.log(room)
                await RoomModel.updateOne({ _id: room._id }, room)
                io.emit('rooms', { type: 'update', data: new RoomAddRes(room) })
            }
            // console.log(rooms[rooms.length - 1])

            socket.emit('rooms/players/goOut/res')
        }
    }

    deletePlayer(socket: any, io: any) {
        return async ({ _id }: { _id: string }) => {
            const player: any = await UserModel.findById(_id).lean()
            const rooms = await RoomModel.find({
                'players.player': _id,
                'players.isOnRoom': true,
            }).lean()

            for (const r of rooms) {
                const room: any = r
                let isDelete = false
                console.log('deleting..., ', room.players)
                const canDelete = room.players.some(
                    (p: any) => p.player.toString() === socket.handshake.idPlayer && p.isRoomMaster,
                )
                if (canDelete) {
                    room.players.forEach((p: any) => {
                        console.log('find..., ', p.player.toString(), _id)
                        if (p.player.toString() === _id) {
                            console.log('deleted...')
                            isDelete = true
                            p.isOnRoom = false
                            console.log('emit ', room._id.toString())
                            io.sockets.sockets
                                .get(player.socketId)
                                .to(room._id.toString())
                                .emit('rooms/players/remove/res', {
                                    data: new RoomPlayerRemoveRes({
                                        player: _id,
                                        position: p.position,
                                    }),
                                })
                        }
                    })
                    if (isDelete) {
                        io.sockets.sockets.get(player.socketId).leave(room._id.toString())
                        io.sockets.sockets.get(player.socketId).handshake.idRoom = undefined
                        // console.log(room)
                        await RoomModel.updateOne({ _id: room._id }, room)
                        io.emit('rooms', { type: 'update', data: new RoomAddRes(room) })
                    }
                }
            }
            // console.log(rooms[rooms.length - 1])

            io.sockets.sockets.get(player.socketId).emit('rooms/players/goOut/res')
        }
    }
}

export default new room()
