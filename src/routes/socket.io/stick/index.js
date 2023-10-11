const stick = require('./stick')

module.exports = async function (socket, io) {
    // y = -(2/25)x^(2) + 8x
    socket.on('stick-stand', async ({ event }) => await stick.stand(socket, io)({ event }))

    socket.on('stick-left', async ({ event }) => await stick.left(socket, io)({ event }))

    socket.on('stick-right', async ({ event }) => await stick.right(socket, io)({ event }))

    socket.on('stick-jump-left', async ({ event }) => await stick.jumpLeft(socket, io)({ event }))

    socket.on('stick-jump-right', async ({ event }) => await stick.jumpRight(socket, io)({ event }))
}
