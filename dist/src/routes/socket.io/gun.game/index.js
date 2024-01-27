"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gunGame_1 = __importDefault(require("../../../services/gunGame"));
function default_1(socket, io) {
    const gunGame = new gunGame_1.default(socket, io);
    const baseUrl = gunGame.baseUrl;
    // gunGame.gun({ angle: 35, velocity_0: 26 })
    socket.on(baseUrl + '/lie', (data) => gunGame.lie(data));
    socket.on(baseUrl + '/to-left', (data) => gunGame.toLeft());
    socket.on(baseUrl + '/to-right', (data) => gunGame.toRight());
    socket.on(baseUrl + '/gun', (data, callback) => gunGame.gun(data, callback));
    socket.on(baseUrl + '/use-card', (data, callback) => gunGame.useCard(data, callback));
    socket.on(baseUrl + '/use-skill', (data, callback) => gunGame.useSkill(data, callback));
    socket.on(baseUrl + '/choose-velocity', (data, callback) => gunGame.chooseVelocity(data, callback));
}
exports.default = default_1;
