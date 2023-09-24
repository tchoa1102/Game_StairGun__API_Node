const { UserModel, RoomModel } = require('../../app/models')

module.exports = function (socket, io) {
    socket.on('users/rooms/create', () => {})
    socket.on('users/rooms/add', ({ idRoom }) => {
        console.log(idRoom)
    })
    socket.on('rooms/create', async () => {
        const idPlayer = socket.handshake.idPlayer
        // const player = UserModel.findById(idPlayer)
        console.log('create player')
        const playerOnRoom = {
            player: idPlayer,
            isOnRoom: true,
            isRoomMaster: true,
        }
        const room = new RoomModel()
        room.players.push(playerOnRoom)

        await room.save()
        socket.join(room._id.toString())
        room._doc.typeMap =
            room.typeMap.toString() === '000000000000000000000000' ? 'Ngẫu nhiên' : 'Tự chọn'
        socket.emit('rooms/players/add/res', {
            data: room,
        })
        io.emit('rooms', { type: 'create', data: room })
    })

    socket.on('rooms/players/add', async ({ idRoom }) => {
        const idPlayer = socket.handshake.idPlayer
        try {
            const player = await UserModel.findById(idPlayer)
            const room = await RoomModel.findById(idRoom)
            const playerOnRoom = {
                player: idPlayer,
                isOnRoom: true,
                isRoomMaster: false,
            }
            console.log(room)
            console.log('Go on room..., idRoom: ', idRoom, ', type room: ', room.type)
            if (room.type === 'Tự do') {
                console.log('Room tu do...')
                room.players.push(playerOnRoom)
                await room.save()

                room._doc.typeMap =
                    room.typeMap.toString() === '000000000000000000000000'
                        ? 'Ngẫu nhiên'
                        : 'Tự chọn'
                socket.join(room._id)
                socket.to(room._id).emit('rooms/players/add/res', {
                    data: {
                        ...playerOnRoom,
                        player: player,
                    },
                })
                io.emit('rooms', {
                    type: 'update',
                    data: room,
                })
            }
        } catch (error) {
            console.log(error)
            return
        }
    })
}
