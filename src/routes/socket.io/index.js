module.exports = function (io) {
    io.on('connection', function (socket) {
        console.log('A user connected')
        socket.on('disconnect', function (socket) {
            console.log('A user disconnected')
        })
    })
}
