const stick = require('./stick')

module.exports = function (io) {
    io.on('connection', function (socket) {
        // console.log(socket)
        socket.emit('connection', { clientId: socket.client.id, socketId: socket.id })
        console.log(`A user connected  ${socket.id}, clientID: ${socket.client.id}`)
        socket.on('disconnect', function () {
            console.log(`A user disconnected, ${socket?.id}, clientID: ${socket?.client?.id}`)
        })
        socket.on('send-message', function (data) {
            console.log(`ClientID: ${socket?.client?.id}, data: ${data}`)
        })
        stick(socket)
    })
}
