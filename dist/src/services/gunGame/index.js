"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameConfig_json_1 = __importDefault(require("../../gameConfig.json"));
const playerLocation_1 = __importDefault(require("./models/playerLocation"));
const helper_1 = require("./helper");
const locationAtTime_1 = __importDefault(require("../../shares/maths/locationAtTime"));
const bullet_1 = __importDefault(require("../../shares/maths/bullet"));
const bullet_2 = __importDefault(require("./models/bullet"));
const point_1 = __importDefault(require("../../shares/maths/point"));
const line_1 = __importDefault(require("../../shares/maths/line"));
const circle_1 = __importDefault(require("../../shares/maths/circle"));
const gun_1 = __importDefault(require("./models/gun"));
const shares_1 = require("../../shares");
const CardDoubleDamage_1 = __importDefault(require("../../shares/cards/CardDoubleDamage"));
class GunGame {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
        this._id = socket.handshake.idPlayer;
        this.vx = 1;
        this.baseUrl = 'gun-game';
        this.keyActivities = {
            show: 'show',
            lieRight: 'lieRight',
            lieLeft: 'lieLeft',
            throwRight: 'throwRight',
            throwLeft: 'throwLeft',
            crawlRight: 'crawlRight',
            crawlLeft: 'crawlLeft',
        };
    }
    lie(req) {
        try {
            const playerData = this.socket.handshake.match.player;
            const dataPOnMainGame = playerData.mainGame;
            const res = new playerLocation_1.default(this._id, [new locationAtTime_1.default(dataPOnMainGame, new Date().getTime())], true, req.event);
            return this.io
                .to(this.socket.handshake.idRoom)
                .emit('gun-game/players/update-location', res);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    // on: gun-game/to-left | emit: gun-game/update-location
    toLeft() {
        var _a, _b;
        try {
            const curMatch = this.socket.handshake.match;
            const phases = gameConfig_json_1.default.gunGame;
            const curTurn = curMatch.logs[curMatch.logs.length - 1];
            const id = ((_a = this._id) === null || _a === void 0 ? void 0 : _a.toString()) || this._id;
            const curTurner = ((_b = curTurn.turner) === null || _b === void 0 ? void 0 : _b.toString()) || curTurn.turner;
            // console.log(id, curTurner, curTurner !== id)
            if (curTurner !== id)
                return;
            if (curTurn.phase !== phases.standbyPhase.key && curTurn.phase !== phases.mainPhase.key)
                return;
            const playerData = this.socket.handshake.match.player;
            const dataPOnMainGame = playerData.mainGame;
            const objsMap = this.socket.handshake.match.objects;
            // console.log('+++++\nBase location: ', dataPOnMainGame.bottomLeft, '\n+++++')
            const playerShape = (0, helper_1.createShapePlayer)(dataPOnMainGame.bottomLeft.x, dataPOnMainGame.bottomLeft.y, dataPOnMainGame.characterGradient);
            // console.log(playerShape)
            // console.log(this.socket.handshake.match.objects)
            const nearest = (0, helper_1.nearestNeighborPolygon)(playerShape, objsMap);
            // console.log('\np1: ', nearest.bottom.p1, '\np2: ', nearest.bottom.p2, '\nfollow: ', nearest.bottom.follow)
            // console.log('Left: ', nearest.left, '\nfollow: ', nearest.bottom.follow)
            const followLine = nearest.bottom.follow;
            if (!Number.isFinite(followLine.distance) ||
                followLine.line.first.x - dataPOnMainGame.bottomLeft.x >=
                    gameConfig_json_1.default.person.width / 2) {
                const isFollowInFinite = !Number.isFinite(followLine.distance);
                // console.log('change, isFollowInFinite: ', isFollowInFinite)
                const nearestX3 = nearest.bottom.p2;
                const isNearestX3Finite = Number.isFinite(nearestX3.distance);
                const nearestX3Valid = isNearestX3Finite && nearestX3.line.first.x < followLine.line.first.x;
                const nearestX2 = nearest.bottom.p1;
                const isNearestX2Finite = Number.isFinite(nearestX2.distance);
                const nearestX2Valid = isNearestX2Finite && nearestX2.line.last.x > followLine.line.last.x;
                if ((isNearestX3Finite && isFollowInFinite) || nearestX3Valid) {
                    followLine.copy(nearestX3);
                }
                else if ((isNearestX2Finite && isFollowInFinite) || nearestX2Valid) {
                    followLine.copy(nearestX2);
                }
                // console.log('New follow line: ', followLine)
            }
            if (!Number.isFinite(followLine.distance)) {
                // const res = new UpdateLocationRes(this._id, [], false)
                // return this.io
                //     .to(this.socket.handshake.idRoom)
                //     .emit('gun-game/players/update-location', res)
                return; // khi nào code ổn rồi thì mở cái trên để gửi khi character die
            }
            // #region update location
            if (followLine.line.last) {
                const distanceCanIncrease = Math.min(1, Math.floor(nearest.left.distance));
                // console.log('Distance can increase: ', distanceCanIncrease)
                dataPOnMainGame.bottomLeft.x -= distanceCanIncrease;
                // dataPOnMainGame.bottomLeft.x -= 1
                dataPOnMainGame.bottomLeft.y = -followLine.line.findYFromX(dataPOnMainGame.bottomLeft.x);
                dataPOnMainGame.characterGradient = followLine.line.calcAngle();
            }
            // console.log('new location: ', dataPOnMainGame.bottomLeft, '\n---------\n')
            // #endregion update location
            // #region res
            const res = new playerLocation_1.default(this._id, [new locationAtTime_1.default(dataPOnMainGame, new Date().getTime())], true, this.keyActivities.crawlLeft);
            return this.io
                .to(this.socket.handshake.idRoom)
                .emit('gun-game/players/update-location', res);
            // #endregion res
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
    toRight() {
        var _a, _b;
        try {
            const curMatch = this.socket.handshake.match;
            const phases = gameConfig_json_1.default.gunGame;
            const curTurn = curMatch.logs[curMatch.logs.length - 1];
            const id = ((_a = this._id) === null || _a === void 0 ? void 0 : _a.toString()) || this._id;
            const curTurner = ((_b = curTurn.turner) === null || _b === void 0 ? void 0 : _b.toString()) || curTurn.turner;
            // console.log(id, curTurner, curTurner !== id)
            if (curTurner !== id)
                return;
            if (curTurn.phase !== phases.standbyPhase.key && curTurn.phase !== phases.mainPhase.key)
                return;
            const playerData = this.socket.handshake.match.player;
            const dataPOnMainGame = playerData.mainGame;
            const objsMap = this.socket.handshake.match.objects;
            // console.log('+++++\nBase location: ', dataPOnMainGame.bottomLeft, '\n+++++')
            const playerShape = (0, helper_1.createShapePlayer)(dataPOnMainGame.bottomLeft.x, dataPOnMainGame.bottomLeft.y, dataPOnMainGame.characterGradient);
            // console.log(playerShape)
            const nearest = (0, helper_1.nearestNeighborPolygon)(playerShape, objsMap);
            // console.log('\np1: ', nearest.bottom.p1, '\np2: ', nearest.bottom.p2, '\nfollow: ', nearest.bottom.follow)
            // console.log('right: ', nearest.right, '\nfollow: ', nearest.bottom.follow)
            const followLine = nearest.bottom.follow;
            if (!Number.isFinite(followLine.distance) ||
                followLine.line.first.x - dataPOnMainGame.bottomLeft.x >=
                    gameConfig_json_1.default.person.width / 2) {
                const isFollowInFinite = !Number.isFinite(followLine.distance);
                // console.log('change, isFollowInFinite: ', isFollowInFinite)
                const nearestX3 = nearest.bottom.p2;
                const isNearestX3Finite = Number.isFinite(nearestX3.distance);
                const nearestX3Valid = isNearestX3Finite && nearestX3.line.first.x < followLine.line.first.x;
                const nearestX2 = nearest.bottom.p1;
                const isNearestX2Finite = Number.isFinite(nearestX2.distance);
                const nearestX2Valid = isNearestX2Finite && nearestX2.line.last.x > followLine.line.last.x;
                if ((isNearestX3Finite && isFollowInFinite) || nearestX3Valid) {
                    followLine.copy(nearestX3);
                }
                else if ((isNearestX2Finite && isFollowInFinite) || nearestX2Valid) {
                    followLine.copy(nearestX2);
                }
                // console.log('New follow line: ', followLine)
            }
            if (!Number.isFinite(followLine.distance)) {
                // const res = new UpdateLocationRes(this._id, [], false)
                // return this.io
                //     .to(this.socket.handshake.idRoom)
                //     .emit('gun-game/players/update-location', res)
                return; // khi nào code ổn rồi thì mở cái trên để gửi khi character die
            }
            // #region update location
            if (followLine.line.last) {
                const distanceCanIncrease = Math.min(1, Math.floor(nearest.right.distance));
                // console.log('Distance can increase: ', distanceCanIncrease)
                dataPOnMainGame.bottomLeft.x += distanceCanIncrease;
                // dataPOnMainGame.bottomLeft.x -= 1
                dataPOnMainGame.bottomLeft.y = -followLine.line.findYFromX(dataPOnMainGame.bottomLeft.x);
                dataPOnMainGame.characterGradient = followLine.line.calcAngle();
            }
            // console.log('new location: ', dataPOnMainGame.bottomLeft, '\n---------\n')
            // #endregion update location
            // #region res
            const res = new playerLocation_1.default(this._id, [new locationAtTime_1.default(dataPOnMainGame, new Date().getTime())], true, this.keyActivities.crawlRight);
            return this.io
                .to(this.socket.handshake.idRoom)
                .emit('gun-game/players/update-location', res);
            // #endregion res
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
    // on: gun-game/gun | emit: gun-game/gun-status
    gun({ angle, velocity_0 }, callback) {
        var _a, _b;
        try {
            const match = this.socket.handshake.match;
            const phases = gameConfig_json_1.default.gunGame;
            const curTurn = match.logs[match.logs.length - 1];
            const id = ((_a = this._id) === null || _a === void 0 ? void 0 : _a.toString()) || this._id;
            const curTurner = ((_b = curTurn.turner) === null || _b === void 0 ? void 0 : _b.toString()) || curTurn.turner;
            // console.log(id, curTurner, curTurner !== id)
            if (curTurner !== id)
                return;
            if (curTurn.phase !== phases.mainPhase.key)
                return;
            curTurn.phase = phases.battlePhase.key;
            // call callback handle of client
            callback();
            // #region handle gun
            // #region handle collision
            const angleSign = angle > 0;
            angle = 90 - angle;
            const windForce = curTurn.windForce;
            console.log('Start battle phase, wind force: ', windForce);
            const playersInfo = this.socket.handshake.match.players;
            const player = this.socket.handshake.match.player;
            const centerPlayer = new point_1.default(player.mainGame.bottomLeft.x + 1, -Math.abs(player.mainGame.bottomLeft.y) + 1);
            // #region init shape players and get center of player
            const playerShapes = [];
            const playersData = playersInfo.reduce((shapes, p) => {
                const tarPlayer = this.io.sockets.sockets.get(p.socketId);
                if (!tarPlayer)
                    return shapes;
                const dataMainGame = Object.assign({}, tarPlayer.handshake.match.player.mainGame);
                const data = Object.assign(Object.assign({}, p.player), { mainGame: dataMainGame });
                dataMainGame.shape = (0, helper_1.createShapePlayer)(dataMainGame.bottomLeft.x, dataMainGame.bottomLeft.y, dataMainGame.characterGradient);
                shapes.push(data);
                playerShapes.push(dataMainGame.shape);
                if (p._id.toString() === player.target._id) {
                    const center = new line_1.default()
                        .init(dataMainGame.shape[3], dataMainGame.shape[0])
                        .center();
                    centerPlayer.copy(center);
                }
                return shapes;
            }, []);
            // console.log('Player shapes: ', playerShapes)
            // #endregion init shape players and get center of player
            const polygonShape = this.socket.handshake.match.objects;
            const bullet = new bullet_1.default(centerPlayer.x, centerPlayer.y, angle, velocity_0, windForce);
            const funcCompare = angleSign ? moreX : lessX;
            const collision = bullet.findCollision(playerShapes, polygonShape, funcCompare);
            console.log(collision);
            const res = new gun_1.default([], []);
            // #endregion handle collision
            // #region calculate when collision
            if (collision) {
                collision.location.y = bullet.parabola.computeY(collision.location.x);
                const circleEffect = new circle_1.default(collision.location, 10);
                // playerInfo = { target: {_id}, mainGame: { ..., shape } }
                const playerCollision = playersData.reduce((result, playerInfo) => {
                    // console.log(playerInfo)
                    const shape = playerInfo.mainGame.shape;
                    const checkResult = circleEffect.isPolygonCollision(shape);
                    if (checkResult.isCollection) {
                        // { target: {_id}, damages: Array<number>, HP: number }
                        const r = {
                            target: {
                                _id: player.target._id,
                            },
                            damages: [],
                            HP: player.mainGame.HP,
                        };
                        console.log('Colision');
                        // result.push()
                        // ----------------------------------------------------------------
                        let damage = player.mainGame.ATK - (3 * playerInfo.mainGame.DEF) / 4;
                        // calculate damage
                        const data = { damage };
                        curTurn.cards.forEach((card) => card.effect(data));
                        r.damages.push(data.damage);
                        r.HP -= data.damage;
                        result.push(r);
                    }
                    return result;
                }, []);
                res.players = playerCollision;
            }
            // #endregion calculate when collision
            // #region calculate list bullet's location
            const bullet0 = new bullet_2.default(new point_1.default(centerPlayer.x, centerPlayer.y), angle);
            const locationsBullet = [bullet0];
            const callbackChangeLocationX = angleSign ? increaseX : decreaseX;
            // console.log('bullet: ', bullet0.point.x, angleSign)
            for (let i = 0.005; i <= gameConfig_json_1.default.gunGame.battlePhase.value; i += 0.005) {
                const x = callbackChangeLocationX(locationsBullet[locationsBullet.length - 1].point.x);
                const bulletPoint = new point_1.default(x, -bullet.parabola.computeY(x));
                const preBullet = locationsBullet[locationsBullet.length - 1].point;
                const lineXAndPreX = new line_1.default().init(preBullet, bulletPoint);
                const locationBullet = new bullet_2.default(bulletPoint, lineXAndPreX.calcAngle());
                if (collision && locationBullet.point.x >= collision.location.x)
                    break;
                locationsBullet.push(locationBullet);
            }
            res.bullets = locationsBullet;
            // #endregion calculate list bullet's location
            // console.log(res)
            // #endregion handle gun
            // start battle phase 15s
            // console.log('Gun start')
            setTimeout(() => {
                // calc damage
                // <--code calc damage--------------------------------------->
            }, phases.battlePhase * 1000);
            // renew timeout to end phase
            curTurn.timeOutNextTurn.close();
            // The time to start next turn, t = battleTime + endTime
            const timeUntilEndPhase = (phases.battlePhase.value + phases.endPhase.value) * 1000;
            curTurn.timeOutNextTurn = setTimeout((_this, match) => {
                console.log('\nTimeout gun\n');
                (0, shares_1.startNewTurn)(_this, match);
            }, timeUntilEndPhase, this, match);
            // console.log('Gun end')
            return this.io.to(this.socket.handshake.idRoom).emit(this.baseUrl + '/gun-status', res);
        }
        catch (e) {
            console.log(e);
            return;
        }
        // #region func
        function moreX(locationX, collisionX) {
            return collisionX - locationX > 1e-8;
        }
        function lessX(locationX, collisionX) {
            return locationX - collisionX > 1e-8;
        }
        function increaseX(x) {
            return x + 1;
        }
        function decreaseX(x) {
            return x - 1;
        }
        // #endregion func
    }
    // on: gun-game/use-card | emit: gun-game/use-card/res
    useCard({ cardId }, callback) {
        try {
            const match = this.socket.handshake.match;
            const card = match.cards.find((c) => c._id === cardId);
            if (!card)
                return;
            if (!card.isEnable || card.owner !== this._id)
                return;
            card.isEnable = false;
            // #region handle add card to list turn's cards
            // <code>
            if (card.data.match === 'CardDoubleDamage') {
                console.log('CardDoubleDamage');
                const c = new CardDoubleDamage_1.default(this);
                c.addList();
            }
            // #endregion handle add card to list turn's cards
            callback();
            return this.io.to(this.socket.handshake.idRoom).emit(this.baseUrl + '/use-card/res', {
                _id: match._id,
                card: card.data._id,
                owner: card.owner,
            });
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
    // on: gun-game/use-skill | emit: gun-game/use-skill/res
    useSkill({ skillId }, callback) {
        var _a, _b;
        try {
            const match = this.socket.handshake.match;
            const phases = gameConfig_json_1.default.gunGame;
            const curTurn = match.logs[match.logs.length - 1];
            const id = ((_a = this._id) === null || _a === void 0 ? void 0 : _a.toString()) || this._id;
            const curTurner = ((_b = curTurn.turner) === null || _b === void 0 ? void 0 : _b.toString()) || curTurn.turner;
            // console.log(id, curTurner, curTurner !== id)
            if (curTurner !== id)
                return;
            if (curTurn.phase !== phases.standbyPhase.key && curTurn.phase !== phases.mainPhase.key)
                return;
            let newSTA = this.socket.handshake.match.player.mainGame.STA;
            switch (skillId) {
                case 'percent10':
                    newSTA -= 10;
                    if (newSTA < 0)
                        return;
                    this.socket.handshake.match.player.mainGame.ATK +=
                        this.socket.handshake.match.player.mainGame.ATK * 0.1;
                    this.socket.handshake.match.player.mainGame.STA -= 10;
                    break;
                case 'percent20':
                    newSTA -= 20;
                    if (newSTA < 0)
                        return;
                    this.socket.handshake.match.player.mainGame.ATK +=
                        this.socket.handshake.match.player.mainGame.ATK * 0.2;
                    this.socket.handshake.match.player.mainGame.STA -= 20;
                    break;
                case 'percent30':
                    newSTA -= 30;
                    if (newSTA < 0)
                        return;
                    this.socket.handshake.match.player.mainGame.ATK +=
                        this.socket.handshake.match.player.mainGame.ATK * 0.3;
                    this.socket.handshake.match.player.mainGame.STA -= 30;
                    break;
                case 'percent50':
                    newSTA -= 50;
                    if (newSTA < 0)
                        return;
                    this.socket.handshake.match.player.mainGame.ATK +=
                        this.socket.handshake.match.player.mainGame.ATK * 0.5;
                    this.socket.handshake.match.player.mainGame.STA -= 50;
                    break;
                default:
                    break;
            }
            callback(newSTA);
            return this.io.to(this.socket.handshake.idRoom).emit(this.baseUrl + '/use-skill/res', {
                _id: match._id,
                card: skillId,
                owner: this._id,
            });
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
    // on: gun-game/choose-velocity
    chooseVelocity(dataAny, callback) {
        var _a, _b, _c;
        try {
            // renew timeout, set timeout of main phase
            const match = this.socket.handshake.match;
            const curTurn = match.logs[match.logs.length - 1];
            const id = ((_a = this._id) === null || _a === void 0 ? void 0 : _a.toString()) || this._id;
            const curTurner = ((_b = curTurn.turner) === null || _b === void 0 ? void 0 : _b.toString()) || curTurn.turner;
            // console.log(id, curTurner, curTurner !== id)
            if (curTurner !== id)
                return;
            const phases = gameConfig_json_1.default.gunGame;
            // console.log(
            //     'Choose velocity: ',
            //     curTurn.phase,
            //     phases.standbyPhase.key,
            //     curTurn.phase !== phases.standbyPhase.key,
            // )
            if (curTurn.phase !== phases.standbyPhase.key)
                return;
            // console.log('Start main phase')
            curTurn.phase = phases.mainPhase.key;
            // match.logs.forEach((turn) => )
            (_c = curTurn.timeOutNextTurn) === null || _c === void 0 ? void 0 : _c.close();
            curTurn.timeOutNextTurn = setTimeout((_this, match) => {
                console.log('\nTimeout velo\n');
                (0, shares_1.startNewTurn)(_this, match);
            }, phases.mainPhase.value * 1000, this, match);
            // console.log('velocity: ', curTurn.timeoutNextTurn)
            // call callback handle of client
            callback();
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
}
exports.default = GunGame;
