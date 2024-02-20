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
const models_1 = require("../app/models");
const firebase_1 = __importDefault(require("../firebase"));
class Middleware {
    decodeToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.headers)
            try {
                const dataAuthorization = req.headers.authorization.split(' ');
                const token = dataAuthorization[1];
                const decodeValue = yield firebase_1.default.auth().verifyIdToken(token);
                if (decodeValue) {
                    // console.log(decodeValue)
                    const id = decodeValue.firebase.identities['google.com'];
                    while (id[0].length < 24) {
                        id[0] += '1';
                    }
                    req.user = decodeValue;
                    return next();
                }
                return res.status(401).json({ message: 'Un authorize' });
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({ message: 'Internal Error' });
            }
        });
    }
    findUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataUser = req.user;
            let id = dataUser.firebase.identities['google.com'][0];
            try {
                let user = yield models_1.UserModel.findById(id).exec();
                if (!user) {
                    user = new models_1.UserModel(Object.assign(Object.assign({}, dataUser), { _id: id }));
                    yield user.save();
                }
                req.user = Object.assign(Object.assign({}, dataUser), user);
                return next();
            }
            catch (e) {
                console.log(e);
                return res.status(404).json({ message: 'Occurred an error' });
            }
        });
    }
    decodeTokenSocket(socket, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = socket.handshake;
            const accessToken = req.auth.token || req.auth.access_token || req.auth.accessToken;
            // console.log(accessToken)
            try {
                const decodeValue = yield firebase_1.default.auth().verifyIdToken(accessToken);
                if (decodeValue) {
                    // console.log(decodeValue)
                    let id = decodeValue.firebase.identities['google.com'][0];
                    while (id.length < 24) {
                        id = id + '1';
                    }
                    socket.handshake.idPlayer = id;
                    const user = yield models_1.UserModel.findById(id).lean();
                    if (!user) {
                        return next(new Error("Couldn't find user!"));
                    }
                    socket.handshake.namePlayer = user.name;
                    next();
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = new Middleware();
