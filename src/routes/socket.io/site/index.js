const match = require('./match')
const room = require('./room')
const player = require('./player')
const item = require('./item')

module.exports = function (socket, io) {
    const playerRoute = new player(socket, io)
    const itemRoute = new item(socket, io)

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

    socket.on('items/wear-or-unbind', async (data, callback) => await itemRoute.wearOrUnbindEquip(data, callback))

    socket.on('player/friends/add', async (data) => await playerRoute.addFriend(data))
    socket.on('player/friends/add/res-add', async (data) => await playerRoute.saveFriend(data))
}
