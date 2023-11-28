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
const Bullet = require('./bullet')
const BulletRes = require('./bulletRes')
const Point = require('./point')
const Line = require('./line')
const Circle = require('./circle')
const GunRes = require('./gunRes')
const MathHelper = require('./math.helper')

module.exports = function (socket, io) {
    const gunGame = new GunGame(socket, io)
    gunGame.gun({ angle: 35, velocity_0: 26 })

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
                dataPOnMainGame.bottomLeft.y = -followLine.line.findYFromX(
                    dataPOnMainGame.bottomLeft.x,
                )
                dataPOnMainGame.characterGradient = followLine.line.calcAngle()
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
                dataPOnMainGame.bottomLeft.y = -followLine.line.findYFromX(
                    dataPOnMainGame.bottomLeft.x,
                )
                dataPOnMainGame.characterGradient = followLine.line.calcAngle()
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

    // on: gun-game/gun | emit: gun-game/gun-status
    gun({ angle, velocity_0 }) {
        try {
            const angleSign = angle > 0
            angle = 90 - angle
            const windForce = 1.1
            const playersInfo = this.socket.handshake.match.players
            const player = this.socket.handshake.match.player
            const centerPlayer = new Point(
                player.mainGame.bottomLeft.x + 1,
                -Math.abs(player.mainGame.bottomLeft.y) + 1,
            )
            const playerShapes = []
            const playersData = playersInfo.reduce((shapes, p) => {
                const tarPlayer = this.io.sockets.sockets.get(p.socketId)
                if (!tarPlayer) return shapes
                const dataMainGame = { ...tarPlayer.handshake.match.player.mainGame }
                const data = { ...p.player, mainGame: dataMainGame }
                dataMainGame.shape = createShapePlayer(
                    dataMainGame.bottomLeft.x,
                    dataMainGame.bottomLeft.y,
                    dataMainGame.characterGradient,
                )
                shapes.push(data)
                playersShapes.push(dataMainGame.shape)
                if (p._id.toString() === player.target._id) {
                    const center = new Line()
                        .init(dataMainGame.shape[3], dataMainGame.shape[0])
                        .center()
                    centerPlayer.copy(center)
                }
                return shapes
            }, [])
            console.log('Player shapes: ', playerShapes)
            const polygonShape = this.socket.handshake.match.objects
            const bullet = new Bullet(centerPlayer.x, centerPlayer.y, angle, velocity_0, windForce)
            const funcCompare = angleSign ? moreX : lessX
            const collision = bullet.findCollision(playerShapes, polygonShape, funcCompare)
            console.log(collision)

            const res = new GunRes([], [])
            // #region calculate when collision
            if (collision) {
                collision.location.y = bullet.parabola.computeY(collision.location.x)
                const circleEffect = new Circle(collision.location, 10)
                // playerInfo = { target: {_id}, mainGame: { ..., shape } }
                const playerCollision = playersData.reduce((result, playerInfo) => {
                    const shape = playerInfo.mainGame.shape
                    const checkResult = circleEffect.isPolygonCollision(shape)
                    if (checkResult.isCollection) {
                        // result.push()
                        // ----------------------------------------------------------------
                        // calculate damage
                    }

                    return result
                }, [])
                res.players = playerCollision
            }
            // #endregion calculate when collision

            // #region calculate list bullet's location
            const bullet0 = new BulletRes(new Point(centerPlayer.x, centerPlayer.y), angle)
            const locationsBullet = [bullet0]

            for (let i = 0.5; i <= configGame.gunGame.battlePhase; i += 0.5) {
                const x = locationsBullet[locationsBullet.length - 1].point.x + 1
                const bulletPoint = new Point(x, bullet.parabola.computeY(x))
                const preBullet = locationsBullet[locationsBullet.length - 1].point
                const lineXAndPreX = new Line().init(preBullet, bulletPoint)
                const locationBullet = new BulletRes(bulletPoint, lineXAndPreX.calcAngle())
                if (collision && locationBullet.point.x >= collision.location.x) break
                locationsBullet.push(locationBullet)
            }
            res.bullets = locationsBullet
            // #endregion calculate list bullet's location

            console.log(res)
            return this.io.to(this.socket.handshake.idRoom).emit('gun-game/gun-status', res)
        } catch (e) {
            console.log(e)
            return
        }

        function moreX(locationX, collisionX) {
            return collisionX - locationX > 1e-8
        }

        function lessX(locationX, collisionX) {
            return locationX - collisionX > 1e-8
        }
    }

    // on: gun-game/use-card | emit: gun-game/use-card/res
    useCard({ cardId }) {
        try {
        } catch (e) {
            console.log(e)
            return
        }
    }

    // on: gun-game/use-skill | emit: gun-game/use-skill/res
    useSkill({ skillId }) {
        try {
        } catch (e) {
            console.log(e)
            return
        }
    }
}
