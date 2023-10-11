class stick {
    constructor() {}

    stand(socket, io) {
        return async ({ event }) => {
            console.log('stand: ')
            const _id = socket.handshake.idPlayer
            io.to('1').emit('stick-keyboard-event', { _id, event, x: 1, y: 0 })
        }
    }
    left(socket, io) {
        return async ({ event }) => {
            const _id = socket.handshake.idPlayer
            console.log('left')
            io.to('1').emit('stick-keyboard-event', { _id, event, x: 1, y: 0 })
        }
    }
    right(socket, io) {
        return async ({ event }) => {
            const _id = socket.handshake.idPlayer
            console.log('right')
            io.to('1').emit('stick-keyboard-event', { _id, event, x: 1, y: 0 })
        }
    }
    jumpLeft(socket, io) {
        return async ({ event }) => {
            const _id = socket.handshake.idPlayer
            console.log('jump-left')
            io.to('1').emit('stick-keyboard-event', { _id, event, x: 1, y: 0 })
        }
    }
    jumpRight(socket, io) {
        return async ({ event }) => {
            const _id = socket.handshake.idPlayer
            console.log('jump-right')
            io.to('1').emit('stick-keyboard-event', { _id, event, x: 1, y: 0 })
        }
    }
}

module.exports = new stick()
