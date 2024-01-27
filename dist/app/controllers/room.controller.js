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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class RoomController {
    // [GET] /api/rooms
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const rooms = yield models_1.RoomModel.find().lean();
            if (Array.isArray(rooms)) {
                const roomsResult = rooms.reduce((total, room) => {
                    let numPlayerOnRoom = 0;
                    room.players.forEach((p) => {
                        if (p.isOnRoom) {
                            numPlayerOnRoom += 1;
                        }
                    });
                    room.typeMap =
                        room.typeMap.toString() === '000000000000000000000000'
                            ? 'Ngẫu nhiên'
                            : 'Tự chọn';
                    if (numPlayerOnRoom > 0) {
                        total.push(room);
                    }
                    return total;
                }, []);
                return res.json({
                    data: roomsResult,
                });
            }
            else {
                return res.json({
                    data: [],
                });
            }
        });
    }
}
exports.default = new RoomController();
