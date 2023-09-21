const site = require('./site')
const chat = require('./chat')
const stick = require('./stick')
const { UserModel } = require('../../app/models')

module.exports = function (io) {
    io.on('connection', function (socket) {
        // console.log(socket)
        // UserModel.findById()
        console.log('idPlayer: ', socket.handshake.idPlayer)
        socket.emit('connection', { clientId: socket.client.id, socketId: socket.id })
        console.log(`A user connected  ${socket.id}, clientID: ${socket.client.id}`)
        socket.on('disconnect', function () {
            console.log(
                `A user disconnected, ${socket?.id}, clientID: ${socket?.client?.id}, idPlayer: ${socket.handshake.idPlayer}`,
            )
        })
        site(socket, io)
        chat(socket, io)
        stick(socket, io)
    })
}

/**
 * socket.client.socket => idSocket
 * socket.client.conn.id => idSocketClient
 */
