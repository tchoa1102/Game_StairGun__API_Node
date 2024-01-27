"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startNewTurn = exports.createStairs = exports.Turn = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const gameConfig_json_1 = __importDefault(require("../gameConfig.json"));
const turn_1 = __importDefault(require("./turn"));
const schemas_1 = require("../app/schemas");
const models_1 = require("../app/models");
require("nerdamer/Algebra");
require("nerdamer/Calculus");
require("nerdamer/Solve");
require("nerdamer/Extra");
var turn_2 = require("./turn");
Object.defineProperty(exports, "Turn", { enumerable: true, get: function () { return __importDefault(turn_2).default; } });
// export function createLineFromTwoPoint(p1: { y: number; x: number }, p2: { y: number; x: number }) {
//     const n = {
//         x: p1.y - p2.y,
//         y: p2.x - p1.x,
//     }
//     // n.x(x - p1.x) + n.y(y - p1.y) = 0
//     // => y = - n.x/n.y(x - p1.x) + p1.y
//     // => y = (-n.x/n.y) * x + (n.x/n.y * p1.x + p1.y)
//     //      x^2, x,          y,     c
//     return [[0, -n.x / n.y, -1], [(n.x / n.y) * p1.x + p1.y]]
// }
// export function findIntersectionXLevel2(line1: any, line2: any) {
//     // console.log(
//     //     '\n\n\n',
//     //     // math.lusolve(
//     //     //     [
//     //     //         [1, 0, -1],
//     //     //         [0, 1, 1],
//     //     //         [0, 0, 0],
//     //     //     ],
//     //     //     [[1], [1], [0]],
//     //     // ),
//     //     math.lusolve(
//     //         [
//     //             [0, 1],
//     //             [0, 1],
//     //         ],
//     //         [[1], [2]],
//     //     ),
//     //     '\n\n\n',
//     // )
//     // line1: d1y = a1x^2 + b1x + c1, line2: d2y = a2x^2 + b2x + c2
//     // |[a1, b1, d1]| = |c1|
//     // |[a2, b2, d2]| = |c2|
//     // |[0, 0, 0]   | = |0|
//     // const matrixVar = [line1[0], line2[0]]
//     // const matrixC = [[...line1[1]], [...line2[1]]]
//     try {
//         // collision between two straights line
//         // if (matrixVar[0].length < 3 && matrixVar[1].length < 3) {
//         //     let intersection = undefined
//         //     intersection = math.lusolve(matrixVar, matrixC)
//         //     return intersection || undefined
//         // }
//         // collision between curved line and straight line
//         // if (matrixVar[0].length >= 3 || matrixVar[1].length >= 3) {
//         // }
//         // const curvedLine = line1[0].length >= 3 ? line1 : line2
//         // const straightLine = line1[0].length < 3 ? line1 : line2
//         const evaluate = `${line1[0][0]}x^2 + (${line1[0][1]})x + (${line1[1][0]}) = ${line2[0][0]}x^2 + ${line2[0][1]}x + ${line2[1][0]}`
//         console.log(evaluate)
//         const x = nerdamer.solve(evaluate, 'x').text()
//         if (x.indexOf('i') !== -1) return undefined
//         const listX = JSON.parse(x)
//         const listY = listX.map((x: any) => {
//             const evaluate = `${line1[0][0]}x^2 + (${line1[0][1]})x + (${line1[1][0]})`
//             const y = JSON.parse(math.simplify(evaluate, { x }).toString())
//             return y
//         })
//         return [listX, listY]
//     } catch (error) {
//         console.log('Two lines parallel!')
//     }
// }
function createStairs() {
    // @return Array[]
    const stairs = [];
    for (let i = 0; i < gameConfig_json_1.default.maxStair; i++) {
        let width = Math.random() * (gameConfig_json_1.default.stair.maxWidth - 100) + 100;
        let x = 0;
        do {
            x = Math.random() * (gameConfig_json_1.default.maxWidthStairGame - 100);
        } while (stairs.find((stair) => stair.x === x) !== undefined);
        let y = 0;
        do {
            y = Math.random() * (gameConfig_json_1.default.maxHeightStairGame - 400) + 300;
        } while (stairs.find((stair) => stair.y === y) !== undefined);
        const SStair = mongoose_1.default.model('stairschema', schemas_1.stairSchema);
        const stair = new SStair({ x, y, width });
        stairs.push(stair);
    }
    return stairs;
}
exports.createStairs = createStairs;
// export function createCards(stairs: Array<any>) {
//     // @return Array[]
//     const cards = []
//     const stairsPassed: Array<any> = []
//     while (cards.length < configGame.maxCard) {
//         // find unique stair
//         let i = Math.floor(Math.random() * configGame.stairs.length)
//         while (stairsPassed.find((j) => j === i) === undefined) {
//             i = Math.floor(Math.random() * configGame.stairs.length)
//         }
//         const selectedUniqueStair = stairs[i]
//         // find location x on stair
//         const x = Math.floor(Math.random() * selectedUniqueStair.width) + selectedUniqueStair.x
//         // result
//     }
// }
function startNewTurn(_this, match) {
    console.log('\n-----------------------');
    console.log('End this turn, start new turn!, ');
    console.log('-----------------------');
    // #region compute before end turn
    // #region status reborn
    const updateStatuses = [];
    const basePlayer = match.players.forEach((p) => {
        const up = {};
        up.target = p._id;
        up.STA = p.STA;
        match.player.mainGame.STA = p.STA;
        match.player.mainGame.ATK = p.ATK;
        match.player.mainGame.DEF = p.DEF;
        match.player.mainGame.LUK = p.LUK;
        updateStatuses.push(up);
    });
    // match.player.mainGame.AGI = basePlayer.AGI
    // #endregion status reborn
    const phases = gameConfig_json_1.default.gunGame;
    const curTurn = match.logs[match.logs.length - 1];
    curTurn.phase = phases.endPhase.key;
    // #region gift
    const { teamA, teamB } = Array.from(match.players).reduce((acc, player) => {
        const p = _this.io.sockets.sockets.get(player.socketId);
        // console.log(player.socketId)
        if (p) {
            // bug: player go out isn't computed
            if (p.handshake.match.player.position < 3) {
                if (p.handshake.match.player.mainGame.HP > 0) {
                    acc.teamA.canPlay.push(player);
                }
                acc.teamA.onRoom.push(player);
            }
            if (p.handshake.match.player.position >= 3) {
                if (p.handshake.match.player.mainGame.HP > 0) {
                    acc.teamB.canPlay.push(player);
                }
                acc.teamB.onRoom.push(player);
            }
        }
        return acc;
    }, {
        teamA: {
            onRoom: [],
            canPlay: [],
        },
        teamB: {
            onRoom: [],
            canPlay: [],
        },
    });
    // console.log(teamA, teamB)
    const statuses = {
        AGI: 0,
        ATK: 0,
        DEF: 0,
        HP: 0,
        LUK: 0,
        STA: 0,
    };
    if ((teamA.onRoom.length === 0 || teamA.canPlay.length === 0) && teamB.onRoom.length !== 0) {
        teamA.onRoom.forEach((p) => {
            statuses.AGI += p.AGI / 2;
            p.AGI /= 2;
            statuses.ATK += p.ATK / 2;
            p.ATK /= 2;
            statuses.DEF += p.DEF / 2;
            p.DEF /= 2;
            statuses.HP += p.HP / 2;
            p.HP /= 2;
            statuses.LUK += p.LUK / 2;
            p.LUK /= 2;
            statuses.STA += p.STA / 2;
            p.STA /= 2;
            models_1.UserModel.updateOne({ _id: p._id }, {
                level: p.level - 1 < 0 ? 0 : p.level - 1,
                AGI: p.AGI,
                ATK: p.ATK,
                DEF: p.DEF,
                HP: p.HP,
                LUK: p.LUK,
                STA: p.STA,
                gold: p.gold + 100,
            })
                .then((result) => console.log('Update success'))
                .catch((err) => console.log(err));
        });
        for (const key in statuses) {
            if (Object.hasOwnProperty.call(statuses, key)) {
                const element = statuses[key];
                statuses[key] = Math.floor(element / teamA.onRoom.length);
            }
        }
        teamB.onRoom.forEach((p) => {
            models_1.UserModel.updateOne({ _id: p._id }, {
                level: p.level + 1,
                AGI: p.AGI + statuses.AGI,
                ATK: p.ATK + statuses.ATK,
                DEF: p.DEF + statuses.DEF,
                HP: p.HP + statuses.HP,
                LUK: p.LUK + statuses.LUK,
                STA: p.STA + statuses.STA,
                gold: p.gold + 200,
            })
                .then(() => console.log('Update success'))
                .catch((err) => console.log(err));
        });
        return _this.io.to(_this.socket.handshake.idRoom).emit(_this.baseUrl + '/game-end', {
            winner: 'teamB',
            statuses,
        });
    }
    else if (teamA.onRoom.length !== 0 &&
        (teamB.onRoom.length === 0 || teamB.canPlay.length === 0)) {
        teamB.onRoom.forEach((p) => {
            statuses.AGI += p.AGI / 2;
            p.AGI /= 2;
            statuses.ATK += p.ATK / 2;
            p.ATK /= 2;
            statuses.DEF += p.DEF / 2;
            p.DEF /= 2;
            statuses.HP += p.HP / 2;
            p.HP /= 2;
            statuses.LUK += p.LUK / 2;
            p.LUK /= 2;
            statuses.STA += p.STA / 2;
            p.STA /= 2;
            models_1.UserModel.updateOne({ _id: p._id }, {
                level: p.level - 1 < 0 ? 0 : p.level - 1,
                AGI: p.AGI,
                ATK: p.ATK,
                DEF: p.DEF,
                HP: p.HP,
                LUK: p.LUK,
                STA: p.STA,
                gold: p.gold + 100,
            })
                .then(() => console.log('Update success'))
                .catch((err) => console.log(err));
        });
        for (const key in statuses) {
            if (Object.hasOwnProperty.call(statuses, key)) {
                const element = statuses[key];
                statuses[key] = Math.floor(element / teamA.onRoom.length);
            }
        }
        teamA.onRoom.forEach((p) => {
            models_1.UserModel.updateOne({ _id: p._id }, {
                level: p.level + 1,
                AGI: p.AGI + statuses.AGI,
                ATK: p.ATK + statuses.ATK,
                DEF: p.DEF + statuses.DEF,
                HP: p.HP + statuses.HP,
                LUK: p.LUK + statuses.LUK,
                STA: p.STA + statuses.STA,
                gold: p.gold + 200,
            })
                .then(() => console.log('Update success'))
                .catch((err) => console.log(err));
        });
        console.log('Room: ', _this.socket.handshake.idRoom);
        return _this.io.to(_this.socket.handshake.idRoom).emit(_this.baseUrl + '/game-end', {
            winner: 'teamA',
            statuses,
        });
    }
    else if (teamA.onRoom.length === 0 && teamB.onRoom.length === 0) {
        return console.log('No player');
    }
    // #endregion gift
    // #region <--code choose next player on new turn-------------------->
    const teamOnNewTurn = !teamA.onRoom.find((p) => p._id === curTurn.turner) ? teamA : teamB;
    const indexNewTurner = Math.floor(Math.random() * teamOnNewTurn.onRoom.length);
    // console.log(teamOnNewTurn, teamA, teamB, indexNewTurner, teamOnNewTurn.onRoom[indexNewTurner])
    const newTurner = teamOnNewTurn.onRoom[indexNewTurner]._id;
    // console.log('Turner: ', newTurner)
    // #endregion <--code choose next player on new turn-------------------->
    // #endregion compute before end turn
    // #region config new turn
    const timeOutStartNewTurn = setTimeout((_this, match) => {
        console.log('\nTimeout next turn, ', match.logs.length, match.logs[match.logs.length - 1].id, '\n');
        startNewTurn(_this, match);
    }, phases.standbyPhase.value * 1000, _this, match);
    const newTurn = new turn_1.default(match.logs.length, timeOutStartNewTurn, newTurner);
    match.logs.push(newTurn);
    const res = Object.assign({ _id: match._id, updateStatuses }, newTurn.res());
    console.log('socket share: ', _this.socket.handshake.idRoom);
    return _this.io.to(_this.socket.handshake.idRoom).emit(_this.baseUrl + '/change-turn/res', res);
    // #endregion config new turn
}
exports.startNewTurn = startNewTurn;
