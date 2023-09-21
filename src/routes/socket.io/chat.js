module.exports = function (socket, io) {
    socket.on('send-message', function (data) {
        console.log(`ClientID: ${socket?.client?.id}, data: ${data}`)
    })
}
