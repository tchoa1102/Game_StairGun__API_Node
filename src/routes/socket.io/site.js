const match = require('./site/match')
const room = require('./site/room')
const player = require('./site/player')

module.exports = function (socket, io) {
    const playerRoute = new player(socket, io)

    socket.on('rooms/create', async () => await room.create(socket, io)())
    socket.on('rooms/players/add', async ({ idRoom }) => await room.add(socket, io)({ idRoom }))
    socket.on('rooms/players/goOut', async () => await room.goOut(socket, io)())
    socket.on(
        'rooms/players/ready',
        async ({ idRoom, isReady }) => await room.ready(socket, io)({ idRoom, isReady }),
    )
    socket.on(
        'rooms/players/change-position',
        async ({ idRoom, position }) => await room.changePosition(socket, io)({ idRoom, position }),
    )
    socket.on(
        'rooms/players/delete',
        async ({ _id }) => await room.deletePlayer(socket, io)({ _id }),
    )

    socket.on(
        'matches/loaded',
        async ({ idMatch, idRoom }) =>
            await match.loadedDataObject(socket, io)({ idMatch, idRoom }),
    )

    socket.on('player/friends/add', async (data) => await playerRoute.addFriend(data))
    socket.on('player/friends/add/res-add', async (data) => await playerRoute.saveFriend(data))
}
