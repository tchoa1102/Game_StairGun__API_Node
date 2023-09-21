const { UserModel, RoomModel } = require('../../app/models')

module.exports = function (socket, io) {
    socket.on('users/rooms/create', () => {})
    socket.on('users/rooms/add', ({ idRoom }) => {
        console.log(idRoom)
    })
    socket.on('rooms/create', () => {
        const idPlayer = socket.handshake.idPlayer
        const player = UserModel.findById(idPlayer)
        const room = new RoomModel({
            players: [player],
        })
        room.players[0].isRoomMaster = true

        room.save()
        socket.join(room._id)
        socket.emit('rooms/players/add/res', { data: room })
        socket.broadcast.emit('rooms', { type: 'create', data: room })
    })

    socket.on('rooms/players/add', ({ idRoom }) => {
        const idPlayer = socket.handshake.idPlayer
        const player = UserModel.findById(idPlayer)
        const room = RoomModel.findById(idRoom)
        if (room.type === 'Tự do') {
            room.players.push(player)
            socket.join(room._id)
            socket.to(room._id).emit('rooms/players/add/res', { data: room })
        }
    })
}
