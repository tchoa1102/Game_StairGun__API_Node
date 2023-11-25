const configGame = require('../../../gameConfig.json')
const UpdateLocationRes = require('./updateLocationRes')
const {
    createShapePlayer,
    nearestNeighborPolygon,
    getLocationOnOxy,
    checkInside,
    calculateAngle,
    findYFromXInStraightLine,
    checkPointInside,
} = require('./helper')
const LocationAtTime = require('./locationAtTime')

module.exports = function (socket, io) {
    const gunGame = new GunGame(socket, io)

    socket.on('gun-game/to-left', (data) => gunGame.toLeft(data))
    socket.on('gun-game/to-right', (data) => gunGame.toRight(data))
    socket.on('gun-game/gun', (data) => gunGame.gun(data))
    socket.on('gun-game/use-card', (data) => gunGame.useCard(data))
}

class GunGame {
    constructor(socket, io) {
        this.socket = socket
        this.io = io
        this._id = socket.handshake.idPlayer
        this.vx = 1
    }

    // on: gun-game/to-left | emit: gun-game/update-location
    toLeft() {
        try {
            const playerData = this.socket.handshake.match.player
            const dataPOnMainGame = playerData.mainGame
            const objsMap = this.socket.handshake.match.objects

            console.log('+++++\nBase location: ', dataPOnMainGame.bottomLeft, '\n+++++')
            const playerShape = createShapePlayer(
                dataPOnMainGame.bottomLeft.x,
                dataPOnMainGame.bottomLeft.y,
                dataPOnMainGame.characterGradient,
            )

            console.log(playerShape)
            const nearest = nearestNeighborPolygon(playerShape, objsMap)
            // console.log('\np1: ', nearest.bottom.p1, '\np2: ', nearest.bottom.p2, '\nfollow: ', nearest.bottom.follow)
            console.log('Left: ', nearest.left, '\nfollow: ', nearest.bottom.follow)
            const followLine = nearest.bottom.follow
            if (
                !Number.isFinite(followLine.distance) ||
                followLine.line.first.x - dataPOnMainGame.bottomLeft.x >=
                    configGame.person.width / 2
            ) {
                const isFollowInFinite = !Number.isFinite(followLine.distance)
                // console.log('change, isFollowInFinite: ', isFollowInFinite)
                const nearestX3 = nearest.bottom.p2
                const isNearestX3Finite = Number.isFinite(nearestX3.distance)
                const nearestX3Valid =
                    isNearestX3Finite && nearestX3.line.first.x < followLine.line.first.x
                const nearestX2 = nearest.bottom.p1
                const isNearestX2Finite = Number.isFinite(nearestX2.distance)
                const nearestX2Valid =
                    isNearestX2Finite && nearestX2.line.last.x > followLine.line.last.x
                if ((isNearestX3Finite && isFollowInFinite) || nearestX3Valid) {
                    followLine.copy(nearestX3)
                } else if ((isNearestX2Finite && isFollowInFinite) || nearestX2Valid) {
                    followLine.copy(nearestX2)
                }
                console.log('New follow line: ', followLine)
            }

            if (!Number.isFinite(followLine.distance)) {
                // const res = new UpdateLocationRes(this._id, [], false)
                // return this.io
                //     .to(this.socket.handshake.idRoom)
                //     .emit('gun-game/players/update-location', res)
                return // khi nào code ổn rồi thì mở cái trên để gửi khi character die
            }
            // #region update location
            if (followLine.line.last) {
                const distanceCanIncrease = Math.min(1, Math.floor(nearest.left.distance))
                // console.log('Distance can increase: ', distanceCanIncrease)
                dataPOnMainGame.bottomLeft.x -= distanceCanIncrease
                // dataPOnMainGame.bottomLeft.x -= 1
                dataPOnMainGame.bottomLeft.y = -findYFromXInStraightLine(
                    dataPOnMainGame.bottomLeft.x,
                    followLine.line.first,
                    followLine.line.last,
                )
                dataPOnMainGame.characterGradient = calculateAngle(
                    followLine.line.first,
                    followLine.line.last,
                )
            }
            console.log('new location: ', dataPOnMainGame.bottomLeft, '\n---------\n')
            // #endregion update location

            // #region res
            const res = new UpdateLocationRes(
                this._id,
                [new LocationAtTime(dataPOnMainGame, new Date().getTime())],
                true,
            )
            return this.io
                .to(this.socket.handshake.idRoom)
                .emit('gun-game/players/update-location', res)
            // #endregion res
        } catch (e) {
            console.log(e)
            return
        }
    }

    toRight() {
        try {
            const playerData = this.socket.handshake.match.player
            const dataPOnMainGame = playerData.mainGame
            const objsMap = this.socket.handshake.match.objects

            console.log('+++++\nBase location: ', dataPOnMainGame.bottomLeft, '\n+++++')
            const playerShape = createShapePlayer(
                dataPOnMainGame.bottomLeft.x,
                dataPOnMainGame.bottomLeft.y,
                dataPOnMainGame.characterGradient,
            )

            console.log(playerShape)
            const nearest = nearestNeighborPolygon(playerShape, objsMap)
            // console.log('\np1: ', nearest.bottom.p1, '\np2: ', nearest.bottom.p2, '\nfollow: ', nearest.bottom.follow)
            console.log('right: ', nearest.right, '\nfollow: ', nearest.bottom.follow)
            const followLine = nearest.bottom.follow
            if (
                !Number.isFinite(followLine.distance) ||
                followLine.line.first.x - dataPOnMainGame.bottomLeft.x >=
                    configGame.person.width / 2
            ) {
                const isFollowInFinite = !Number.isFinite(followLine.distance)
                // console.log('change, isFollowInFinite: ', isFollowInFinite)
                const nearestX3 = nearest.bottom.p2
                const isNearestX3Finite = Number.isFinite(nearestX3.distance)
                const nearestX3Valid =
                    isNearestX3Finite && nearestX3.line.first.x < followLine.line.first.x
                const nearestX2 = nearest.bottom.p1
                const isNearestX2Finite = Number.isFinite(nearestX2.distance)
                const nearestX2Valid =
                    isNearestX2Finite && nearestX2.line.last.x > followLine.line.last.x
                if ((isNearestX3Finite && isFollowInFinite) || nearestX3Valid) {
                    followLine.copy(nearestX3)
                } else if ((isNearestX2Finite && isFollowInFinite) || nearestX2Valid) {
                    followLine.copy(nearestX2)
                }
                console.log('New follow line: ', followLine)
            }

            if (!Number.isFinite(followLine.distance)) {
                // const res = new UpdateLocationRes(this._id, [], false)
                // return this.io
                //     .to(this.socket.handshake.idRoom)
                //     .emit('gun-game/players/update-location', res)
                return // khi nào code ổn rồi thì mở cái trên để gửi khi character die
            }
            // #region update location
            if (followLine.line.last) {
                const distanceCanIncrease = Math.min(1, Math.floor(nearest.right.distance))
                // console.log('Distance can increase: ', distanceCanIncrease)
                dataPOnMainGame.bottomLeft.x += distanceCanIncrease
                // dataPOnMainGame.bottomLeft.x -= 1
                dataPOnMainGame.bottomLeft.y = -findYFromXInStraightLine(
                    dataPOnMainGame.bottomLeft.x,
                    followLine.line.first,
                    followLine.line.last,
                )
                dataPOnMainGame.characterGradient = calculateAngle(
                    followLine.line.first,
                    followLine.line.last,
                )
            }
            console.log('new location: ', dataPOnMainGame.bottomLeft, '\n---------\n')
            // #endregion update location

            // #region res
            const res = new UpdateLocationRes(
                this._id,
                [new LocationAtTime(dataPOnMainGame, new Date().getTime())],
                true,
            )
            return this.io
                .to(this.socket.handshake.idRoom)
                .emit('gun-game/players/update-location', res)
            // #endregion res
        } catch (e) {
            console.log(e)
            return
        }
    }

    gun({ angle, force }) {
        try {
        } catch (e) {
            console.log(e)
            return
        }
    }

    useCard({ cardId }) {
        try {
        } catch (e) {
            console.log(e)
            return
        }
    }

    useSkill({ skillId }) {
        try {
        } catch (e) {
            console.log(e)
            return
        }
    }
}
