"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../../../app/models");
const room_add_res_1 = __importDefault(require("./room.add.res"));
const room_player_remove_res_1 = __importDefault(require("./room.player.remove.res"));
const room_res_1 = __importDefault(require("./room.res"));
const shares_1 = require("../../../../shares");
const match_res_1 = __importDefault(require("../match/match.res"));
const card_controller_1 = __importDefault(require("../../../../app/controllers/card.controller"));
const turn_1 = __importDefault(require("../../../../shares/turn"));
class room {
    // #region again
    // emit: rooms/players/add/res, res/error
    reGoIntoMatch(socket, io) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    // #endregion again
    // on: rooms/players/change-position | emit: res/error, rooms/players/change-position/res
    changePosition(socket, io) {
        return ({ idRoom, position }) => __awaiter(this, void 0, void 0, function* () {
            const idPlayer = socket.handshake.idPlayer;
            try {
                const room = yield models_1.RoomModel.findById(idRoom).lean();
                if (!room) {
                    return socket.emit('res/error', { status: 404, message: 'Room not found!' });
                }
                let playerIndex = -1;
                const isPositionNoEmpty = room.players.some((p, index) => {
                    if (p.player.toString() === idPlayer)
                        playerIndex = index;
                    return p.isOnRoom && p.position === position;
                });
                if (isPositionNoEmpty || playerIndex === -1) {
                    return socket.emit('res/error', {
                        status: 404,
                        message: 'Position is not empty!',
                    });
                }
                room.players[playerIndex].position = position;
                yield models_1.RoomModel.updateOne({ _id: room._id }, room);
                return io.to(idRoom).emit('rooms/players/change-position/res', {
                    player: idPlayer,
                    position: position,
                });
            }
            catch (error) {
                console.log(error);
                return socket.emit('res/error', { status: 500 });
            }
        });
    }
    // on: rooms/players/ready | emit: matches/create/res, rooms/players/ready/res, res/error
    ready(socket, io) {
        return ({ idRoom, isReady }) => __awaiter(this, void 0, void 0, function* () {
            const idPlayer = socket.handshake.idPlayer;
            try {
                const room = yield models_1.RoomModel.findById(idRoom).lean();
                if (!room) {
                    socket.emit('res/error', { status: 404 });
                    return;
                }
                let player = {};
                const teamA = [];
                const teamB = [];
                room.players.forEach((p) => {
                    if (p.player.toString() === idPlayer) {
                        p.isReady = isReady;
                        Object.assign(player, p);
                    }
                    if (p.isOnRoom && p.isReady) {
                        if (p.position < 3) {
                            teamA.push(p.position);
                        }
                        else {
                            teamB.push(p.position);
                        }
                    }
                });
                // console.log(room.players)
                yield models_1.RoomModel.updateOne({ _id: room._id }, room);
                if (teamA.length !== teamB.length) {
                    return io.to(idRoom).emit('rooms/players/ready/res', new room_res_1.default({
                        _id: idRoom,
                        player: Object.assign(Object.assign({}, player), { _id: idPlayer, isReady: isReady }),
                    }));
                }
                else {
                    io.to(idRoom).emit('rooms/players/ready/res', new room_res_1.default({
                        _id: idRoom,
                        player: Object.assign(Object.assign({}, player), { _id: idPlayer, isReady: isReady }),
                    }));
                }
                if (teamA.length > 0 && teamA.length === teamB.length) {
                    const listStair = (0, shares_1.createStairs)();
                    // console.log(listStair)
                    const characters = yield models_1.CharacterModel.find({
                        name: /stick-/,
                    });
                    const maps = yield models_1.MapModel.find();
                    const mapChosenIndex = Math.floor(Math.random() * maps.length);
                    const map = yield maps[mapChosenIndex].populate('objects.data');
                    // console.log('\n\nMap: ', map)
                    const configCircleStick = characters[0].srcConfig;
                    const timeStart = new Date().toISOString();
                    const newMatch = new models_1.MatchModel({
                        timeStart,
                        curTiled: '',
                        stairs: listStair,
                        map: map._id,
                    });
                    const cardsData = yield card_controller_1.default.createListCards(newMatch._id, listStair);
                    const cards = cardsData.cards;
                    // #region convert players
                    const players = [];
                    for (const p of room.players) {
                        if (p.isOnRoom) {
                            const dataPlayer = yield models_1.UserModel.findById(p.player).lean();
                            const indexStair = Math.floor(Math.random() * listStair.length);
                            const indexLocationOnMap = Math.floor(Math.random() * map.playersLocations.length);
                            const player = {
                                match: newMatch._id,
                                target: dataPlayer,
                                position: p.position,
                                mainGame: {
                                    bottomLeft: Object.assign({}, map.playersLocations[indexLocationOnMap].toObject()),
                                    characterGradient: 90,
                                    HP: Number.parseFloat(dataPlayer.HP),
                                    STA: Number.parseFloat(dataPlayer.STA),
                                    ATK: Number.parseFloat(dataPlayer.ATK),
                                    DEF: Number.parseFloat(dataPlayer.DEF),
                                    LUK: Number.parseFloat(dataPlayer.LUK),
                                    AGI: Number.parseFloat(dataPlayer.AGI),
                                    skillsUsing: [],
                                    cardsUsing: [],
                                    stateEffects: [],
                                },
                                stairGame: {
                                    x: listStair[indexStair].x +
                                        Math.random() * listStair[indexStair].width,
                                    y: listStair[indexStair].y,
                                    vx: 0,
                                    vy: 0,
                                },
                            };
                            const pl = new models_1.PlayerOnMatchModel(player);
                            yield pl.save();
                            players.push(player);
                        }
                    }
                    // #endregion convert players
                    const turner = players[0].target._id;
                    const logs = [];
                    const matchConfig = {
                        match: newMatch._id,
                        map: map._id,
                        logs,
                        stairs: listStair,
                        cards: cardsData.cardsDetail,
                        timeStart: timeStart,
                        players: players.map((p) => p.target),
                        player: players[0],
                        objects: map.objects,
                        endEventTime: Math.abs(new Date().getTime() - new Date(0).getTime()),
                    };
                    const t = setTimeout((_this, match) => {
                        console.log('\nTimeout begin\n');
                        (0, shares_1.startNewTurn)(_this, match);
                    }, 20000, {
                        io,
                        socket,
                        _id: turner,
                        baseUrl: 'gun-game',
                    }, matchConfig);
                    const turnConfig = new turn_1.default(0, t, turner);
                    logs.push(turnConfig);
                    players.forEach((player) => {
                        const dataSaveSocket = {
                            _id: newMatch._id,
                            match: newMatch._id,
                            map: map._id,
                            logs,
                            stairs: listStair,
                            cards: cardsData.cardsDetail,
                            timeStart: timeStart,
                            players: players.map((p) => p.target),
                            player,
                            objects: map.objects,
                            eventState: undefined,
                            endEventTime: Math.abs(new Date().getTime() - new Date(0).getTime()),
                        };
                        io.sockets.sockets.get(player.target.socketId).handshake.match =
                            dataSaveSocket;
                        // console.log('data day: ', socket.handshake.match.player)
                    });
                    yield newMatch.save();
                    // console.log('Create match: ', newMatch)
                    const dataMatchRes = Object.assign(Object.assign({}, newMatch.toObject()), { players: players.map((p) => (Object.assign(Object.assign({}, p), { target: p.target }))), cards });
                    const dataRes = new match_res_1.default(dataMatchRes, configCircleStick, map.objects, map.backgroundGunGame);
                    dataRes.turner = turner;
                    dataRes.windForce = turnConfig.windForce;
                    // console.log(dataRes)
                    return io.to(idRoom).emit('matches/create/res', {
                        data: dataRes,
                    });
                }
            }
            catch (error) {
                console.log(error);
                socket.emit('res/error', { status: 500 });
            }
        });
    }
    // on: rooms/players/add | emit: rooms, rooms/players/add/res, res/error
    add(socket, io) {
        return ({ idRoom }) => __awaiter(this, void 0, void 0, function* () {
            const idPlayer = socket.handshake.idPlayer;
            try {
                const room = yield models_1.RoomModel.findById(idRoom);
                console.log('Go on room..., idRoom: ', idRoom, ', type room: ', room.type, ', player: ' + idPlayer);
                const nowPlayerOnRoom = yield models_1.RoomModel.find({
                    'players.player': socket.handshake.idPLayer,
                    'players.isOnRoom': true,
                });
                if (nowPlayerOnRoom.length > 0) {
                    socket.emit('res/error', {
                        status: 400,
                        message: 'Người chơi đã có phòng!',
                    });
                    return;
                }
                if (room.type === 'Tự do') {
                    let newPosition = 0;
                    const countPlayerOnRoom = room.players.reduce((total, p) => {
                        if (newPosition === p.position && p.isOnRoom)
                            newPosition += 1;
                        if (p.isOnRoom)
                            total += 1;
                        return total;
                    }, 0);
                    if (countPlayerOnRoom < room.maxNum) {
                        const playerGoOnAgain = room.players.find((p) => p.player.toString() === socket.handshake.idPlayer);
                        if (playerGoOnAgain !== undefined) {
                            playerGoOnAgain.isOnRoom = true;
                            playerGoOnAgain.position = newPosition;
                        }
                        else {
                            // console.log('Room tu do...')
                            const playerOnRoom = {
                                player: idPlayer,
                                position: newPosition,
                            };
                            room.players.push(playerOnRoom);
                        }
                        yield room.save();
                        // console.log(room.players)
                        socket.join(room._id.toString());
                        socket.handshake.idRoom = room._id.toString();
                        const r = room.toObject();
                        const playersOnRoom = [];
                        for (const p of r.players) {
                            if (p.isOnRoom) {
                                const player = yield models_1.UserModel.findById(p.player).lean();
                                p.player = player;
                                playersOnRoom.push(p);
                            }
                        }
                        r.players = playersOnRoom;
                        io.to(room._id.toString()).emit('rooms/players/add/res', {
                            data: new room_add_res_1.default(r),
                        });
                        io.emit('rooms', {
                            type: 'update',
                            data: room,
                        });
                        return;
                    }
                    return socket.emit('res/error', {
                        status: 400,
                        message: 'Vào phòng thất bại!',
                    });
                }
            }
            catch (error) {
                console.log(error);
                socket.emit('res/error', {
                    status: 400,
                    message: 'Phòng không tồn tại!',
                });
                return;
            }
            return;
        });
    }
    // on: rooms/create | emit: rooms, rooms/players/add/res, res/error
    create(socket, io) {
        return () => __awaiter(this, void 0, void 0, function* () {
            const idPlayer = socket.handshake.idPlayer;
            console.log('Create room from request of: ' + idPlayer);
            // const player = await UserModel.findById(idPlayer)
            const nowPlayerOnRoom = yield models_1.RoomModel.find({
                'players.player': socket.handshake.idPlayer,
                'players.isOnRoom': true,
            });
            if (nowPlayerOnRoom.length > 0) {
                socket.emit('res/error', {
                    status: 400,
                    message: 'Người chơi đã có phòng!',
                });
                return;
            }
            else {
                console.log('create player');
                try {
                    const player = yield models_1.UserModel.findById(idPlayer);
                    const playerOnRoom = {
                        player: idPlayer,
                        isRoomMaster: true,
                        position: 0,
                    };
                    const room = new models_1.RoomModel();
                    room.players.push(playerOnRoom);
                    yield room.save();
                    const r = room.toObject();
                    socket.join(r._id.toString());
                    socket.handshake.idRoom = r._id.toString();
                    io.emit('rooms', { type: 'create', data: new room_add_res_1.default(r) });
                    r.players[0].player = Object.assign({}, player.toObject());
                    socket.emit('rooms/players/add/res', {
                        data: new room_add_res_1.default(r),
                    });
                }
                catch (error) {
                    console.log('create room: ', error);
                    socket.emit('rooms/players/add/error', {
                        status: 400,
                        message: 'Người chơi không hợp lệ!',
                    });
                }
                return;
            }
        });
    }
    // on: rooms/players/goOut | emit: rooms, rooms/players/goOut/res, rooms/players/remove/res,
    goOut(socket, io) {
        return () => __awaiter(this, void 0, void 0, function* () {
            const idPlayer = socket.handshake.idPlayer;
            const rooms = yield models_1.RoomModel.find({
                'players.player': socket.handshake.idPlayer,
                'players.isOnRoom': true,
            }).lean();
            console.log('Go out: ' + socket.handshake.idPlayer);
            for (const r of rooms) {
                const room = r;
                room.players.forEach((p) => {
                    if (p.player.toString() === idPlayer) {
                        p.isOnRoom = false;
                        let newMaster = undefined;
                        if (p.isRoomMaster) {
                            p.isRoomMaster = false;
                            const otherP = room.players.find((p) => p.isOnRoom && p.player.toString() !== idPlayer);
                            if (otherP) {
                                otherP.isRoomMaster = true;
                                newMaster = otherP.player;
                            }
                        }
                        console.log('emit ', room._id.toString());
                        socket.to(room._id.toString()).emit('rooms/players/remove/res', {
                            data: new room_player_remove_res_1.default({
                                player: idPlayer,
                                position: p.position,
                                newMaster,
                            }),
                        });
                    }
                });
                socket.leave(room._id.toString());
                socket.handshake.idRoom = undefined;
                // console.log(room)
                yield models_1.RoomModel.updateOne({ _id: room._id }, room);
                io.emit('rooms', { type: 'update', data: new room_add_res_1.default(room) });
            }
            // console.log(rooms[rooms.length - 1])
            socket.emit('rooms/players/goOut/res');
        });
    }
    deletePlayer(socket, io) {
        return ({ _id }) => __awaiter(this, void 0, void 0, function* () {
            const player = yield models_1.UserModel.findById(_id).lean();
            const rooms = yield models_1.RoomModel.find({
                'players.player': _id,
                'players.isOnRoom': true,
            }).lean();
            for (const r of rooms) {
                const room = r;
                let isDelete = false;
                console.log('deleting..., ', room.players);
                const canDelete = room.players.some((p) => p.player.toString() === socket.handshake.idPlayer && p.isRoomMaster);
                if (canDelete) {
                    room.players.forEach((p) => {
                        console.log('find..., ', p.player.toString(), _id);
                        if (p.player.toString() === _id) {
                            console.log('deleted...');
                            isDelete = true;
                            p.isOnRoom = false;
                            console.log('emit ', room._id.toString());
                            io.sockets.sockets
                                .get(player.socketId)
                                .to(room._id.toString())
                                .emit('rooms/players/remove/res', {
                                data: new room_player_remove_res_1.default({
                                    player: _id,
                                    position: p.position,
                                }),
                            });
                        }
                    });
                    if (isDelete) {
                        io.sockets.sockets.get(player.socketId).leave(room._id.toString());
                        io.sockets.sockets.get(player.socketId).handshake.idRoom = undefined;
                        // console.log(room)
                        yield models_1.RoomModel.updateOne({ _id: room._id }, room);
                        io.emit('rooms', { type: 'update', data: new room_add_res_1.default(room) });
                    }
                }
            }
            // console.log(rooms[rooms.length - 1])
            io.sockets.sockets.get(player.socketId).emit('rooms/players/goOut/res');
        });
    }
}
exports.default = new room();
