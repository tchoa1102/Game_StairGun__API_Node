const site = require('./site')
const chat = require('./chat')
const stick = require('./stick')
const room = require('./site/room')
const { RoomModel, UserModel } = require('../../app/models')

module.exports = function (io) {
    io.on('connection', async function (socket) {
        // #region when first connected
        // console.log(socket)
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
            const roomNow = await RoomModel.find({ 'players.isOnRoom': true })

            const idPlayer = socket.handshake.idPlayer
            for (let room of roomNow) {
                for (let p of room.players) {
                    // console.log(p)
                    if (p.player.toString() === idPlayer) {
                        p.isOnRoom = false
                        p.isRoomMaster = false
                        for (let otherP of room.players) {
                            if (otherP.player.toString() !== idPlayer && otherP.isOnRoom === true) {
                                otherP.isRoomMaster = true
                                break
                            }
                        }
                        break
                    }
                }
                // console.log(room)
                await room.save()
            }
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
