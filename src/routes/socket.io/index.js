const site = require('./site')
const chat = require('./chat')
const stick = require('./stick')
const room = require('./site/room')
const { RoomModel, UserModel } = require('../../app/models')
const RoomAddRes = require('./site/room.add.res')

module.exports = function (io) {
    io.on('connection', async function (socket) {
        // #region when first connected
        // console.log(socket)
        socket.join('1')
        console.log('idPlayer: ', socket.handshake.idPlayer)
        const dataSendWhenConnection = { clientId: socket.client.id, socketId: socket.id }
        try {
            await UserModel.updateOne(
                { _id: socket.handshake.idPlayer },
                {
                    socketId: dataSendWhenConnection.socketId,
                    clientId: dataSendWhenConnection.clientId,
                },
            )
        } catch (error) {
            console.log("changing player's socket id: ", error)
        }

        socket.emit('connection', dataSendWhenConnection)
        console.log(`A user connected  ${socket.id}, clientID: ${socket.client.id}`)
        // #endregion when first connected

        // when disconnect
        socket.on('disconnect', async function () {
            console.log(
                `A user disconnected, ${socket?.id}, clientID: ${socket?.client?.id}, idPlayer: ${socket.handshake.idPlayer}`,
            )

            await UserModel.updateOne(
                { _id: socket.handshake.idPlayer },
                {
                    socketId: null,
                    clientId: null,
                },
            )

            // go out room
            room.goOut(socket, io)()
        })

        // other
        site(socket, io)
        chat(socket, io)
        stick(socket, io)
    })
}

/**
 * socket.client.socket => idSocket
 * socket.client.conn.id => idSocketClient
 */
