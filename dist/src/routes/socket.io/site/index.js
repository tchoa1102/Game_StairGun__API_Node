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
const match_1 = __importDefault(require("./match"));
const room_1 = __importDefault(require("./room"));
const player_1 = __importDefault(require("./player"));
const item_1 = __importDefault(require("./item"));
function default_1(socket, io) {
    const playerRoute = new player_1.default(socket, io);
    const itemRoute = new item_1.default(socket, io);
    socket.on('rooms/create', () => __awaiter(this, void 0, void 0, function* () { return yield room_1.default.create(socket, io)(); }));
    socket.on('rooms/players/add', ({ idRoom }) => __awaiter(this, void 0, void 0, function* () { return yield room_1.default.add(socket, io)({ idRoom }); }));
    socket.on('rooms/players/goOut', () => __awaiter(this, void 0, void 0, function* () { return yield room_1.default.goOut(socket, io)(); }));
    socket.on('rooms/players/ready', ({ idRoom, isReady }) => __awaiter(this, void 0, void 0, function* () { return yield room_1.default.ready(socket, io)({ idRoom, isReady }); }));
    socket.on('rooms/players/change-position', ({ idRoom, position }) => __awaiter(this, void 0, void 0, function* () { return yield room_1.default.changePosition(socket, io)({ idRoom, position }); }));
    socket.on('rooms/players/delete', ({ _id }) => __awaiter(this, void 0, void 0, function* () { return yield room_1.default.deletePlayer(socket, io)({ _id }); }));
    socket.on('matches/loaded', ({ idMatch, idRoom }) => __awaiter(this, void 0, void 0, function* () { return yield match_1.default.loadedDataObject(socket, io)({ idMatch, idRoom }); }));
    socket.on('items/wear-or-unbind', (data, callback) => __awaiter(this, void 0, void 0, function* () { return yield itemRoute.wearOrUnbindEquip(data, callback); }));
    socket.on('player/friends/add', (data) => __awaiter(this, void 0, void 0, function* () { return yield playerRoute.addFriend(data); }));
    socket.on('player/friends/add/res-add', (data) => __awaiter(this, void 0, void 0, function* () { return yield playerRoute.saveFriend(data); }));
}
exports.default = default_1;
