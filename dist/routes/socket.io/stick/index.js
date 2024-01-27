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
const stick_1 = __importDefault(require("./stick"));
function default_1(socket, io) {
    return __awaiter(this, void 0, void 0, function* () {
        // y = -(2/25)x^(2) + 8x
        const stick = new stick_1.default(socket, io);
        socket.on('stick-stand', ({ event }) => stick.stand({ event }));
        socket.on('stick-left', ({ event }) => stick.left({ event }));
        socket.on('stick-right', ({ event }) => stick.right({ event }));
        socket.on('stick-jump-left', ({ event }) => stick.jumpLeft({ event }));
        socket.on('stick-jump-right', ({ event }) => stick.jumpRight({ event }));
    });
}
exports.default = default_1;
