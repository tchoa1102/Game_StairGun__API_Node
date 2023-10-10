module.exports = async function (socket, io) {
    // y = -(2/25)x^(2) + 8x
    socket.on('stick-stand', function ({ event }) {
        console.log('stand: ')
        const _id = socket.handshake.idPlayer
        socket.emit('stick-keyboard-event', { _id, event, x: 1, y: 0 })
    })

    socket.on('stick-left', function ({ event }) {
        const _id = socket.handshake.idPlayer
        console.log('left')
        socket.emit('stick-keyboard-event', { _id, event, x: 1, y: 0 })
    })

    socket.on('stick-right', function ({ event }) {
        const _id = socket.handshake.idPlayer
        console.log('right')
        socket.emit('stick-keyboard-event', { _id, event, x: 1, y: 0 })
    })

    socket.on('stick-jump-left', function ({ event }) {
        const _id = socket.handshake.idPlayer
        console.log('jump-left')
        socket.emit('stick-keyboard-event', { _id, event, x: 1, y: 0 })
    })

    socket.on('stick-jump-right', function ({ event }) {
        const _id = socket.handshake.idPlayer
        console.log('jump-right')
        socket.emit('stick-keyboard-event', { _id, event, x: 1, y: 0 })
    })
}
