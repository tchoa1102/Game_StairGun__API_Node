module.exports = async function (socket) {
    socket.on('stick-stand', function ({ _id, socketId, event }) {
        console.log('stand: ')
        socket.emit('stick-keyboard-event', { _id, event, x: 1, y: 0 })
    })

    socket.on('stick-left', function ({ _id, socketId, event }) {
        console.log('stick-left ', _id, ' ', socketId)
        socket.emit('stick-keyboard-event', { _id, event, x: 1, y: 0 })
    })

    socket.on('stick-right', function ({ _id, socketId, event }) {
        console.log('stick-right ', _id, ' ', socketId)
        socket.emit('stick-keyboard-event', { _id, event, x: 1, y: 0 })
    })

    socket.on('stick-jump-left', function ({ _id, socketId, event }) {
        socket.emit('stick-keyboard-event', { _id, event, x: 1, y: 0 })
    })

    socket.on('stick-jump-right', function ({ _id, socketId, event }) {
        socket.emit('stick-keyboard-event', { _id, event, x: 1, y: 0 })
    })
}
