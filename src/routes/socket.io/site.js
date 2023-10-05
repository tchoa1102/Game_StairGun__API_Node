const room = require('./site/room')

module.exports = function (socket, io) {
    socket.on('rooms/create', async () => await room.create(socket, io)())
    socket.on('rooms/players/add', async ({ idRoom }) => await room.add(socket, io)({ idRoom }))
    socket.on('rooms/players/goOut', async () => await room.goOut(socket, io)())
}
