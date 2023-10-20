const Stick = require('./stick')

module.exports = async function (socket, io) {
    // y = -(2/25)x^(2) + 8x
    const stick = new Stick(socket, io)
    socket.on('stick-stand', ({ event }) => stick.stand({ event }))

    socket.on('stick-left', ({ event }) => stick.left({ event }))

    socket.on('stick-right', ({ event }) => stick.right({ event }))

    socket.on('stick-jump-left', ({ event }) => stick.jumpLeft({ event }))

    socket.on('stick-jump-right', ({ event }) => stick.jumpRight({ event }))
}
