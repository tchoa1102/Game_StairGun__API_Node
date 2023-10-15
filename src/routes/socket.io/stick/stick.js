const config = require('../../../gameConfig.json')
const StickEventRes = require('./stick..event.res')

class stick {
    constructor() {
        this.EVENT = 'stick-keyboard-event'
        this._id = undefined
    }

    getId(socket) {
        return socket.handshake.idPlayer
    }

    getLocation(socket) {
        return socket.handshake.match.players[this._id].stairGame
    }

    setId(id) {
        this._id = id
    }

    resetLocation(location) {
        location.vx = 0
        location.vy = 0
    }

    updateLocation(location) {
        location.x = location.x + location.vx
        location.y = location.y + location.vy
    }

    stand(socket, io) {
        return async ({ event }) => {
            this.setId(this.getId(socket))
            const location = this.getLocation(socket)
            console.log('stand: ', location)
            this.resetLocation(location)
            this.updateLocation(location)
            io.to(socket.handshake.idRoom).emit(
                this.EVENT,
                new StickEventRes(this._id, event, location.x, location.y),
            )
        }
    }
    left(socket, io) {
        return async ({ event }) => {
            this.setId(this.getId(socket))
            const location = this.getLocation(socket)
            console.log('left: ', location)
            location.vx = -4
            this.updateLocation(location)
            io.to(socket.handshake.idRoom).emit(
                this.EVENT,
                new StickEventRes(this._id, event, location.x, location.y),
            )
        }
    }
    right(socket, io) {
        return async ({ event }) => {
            this.setId(this.getId(socket))
            const location = this.getLocation(socket)
            console.log('right: ', location)
            location.vx = 4
            this.updateLocation(location)
            io.to(socket.handshake.idRoom).emit(
                this.EVENT,
                new StickEventRes(this._id, event, location.x, location.y),
            )
        }
    }
    jumpLeft(socket, io) {
        return async ({ event }) => {
            this.setId(this.getId(socket))
            const location = this.getLocation(socket)
            console.log('jump-left: ', location)
            location.vx = -4
            location.vy = -20
            this.updateLocation(location)
            io.to(socket.handshake.idRoom).emit(
                this.EVENT,
                new StickEventRes(this._id, event, location.x, location.y),
            )
        }
    }
    jumpRight(socket, io) {
        return async ({ event }) => {
            this.setId(this.getId(socket))
            const location = this.getLocation(socket)
            console.log('jump-right: ', location)
            location.vx = 4
            location.vy = -20
            this.updateLocation(location)
            io.to(socket.handshake.idRoom).emit(
                this.EVENT,
                new StickEventRes(this._id, event, location.x, location.y),
            )
        }
    }
}

function setStand() {}

function freeFall({ x, y }, kDistance) {
    // s = v0t + 1/2g*t^2, with g = 9.8 m/s^2, v0 = 0
    // => s = 1/2 * 9.8 * t^2 (m), set 1m = 1pixel
    // => t = sqrt(2 * s / 9.8 ) = sqrt(2 * kDistance / 9.8)
    // => t = 0 <=> kDistance = 0 => no distance => can move
    return {
        time: Math.sqrt((2 * kDistance) / 9.8),
        location: {
            x,
            y: y + kDistance,
        },
    }
}

// góc phải dưới: {x1, y1} (trái trên), {x2, y2} (phải trên),
// {x3, y3} (phải dưới), {x4, y4} (trái dưới)
function createShapeStick(x3, y3, w, h) {
    return [
        { x: x3 - w, y: y3 - h },
        { x: x3, y: y3 - h },
        { x: x3, y: y3 },
        { x: x3 - w, y: y3 },
    ]
}

module.exports = new stick()
