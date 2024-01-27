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
const { stairSchema } = require('../schemas');
const { CharacterModel, MapModel } = require('../models');
class MatchController {
    // [GET] /api/matches/:match/users/:user
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.json({ message: 'Hello matches' });
        });
    }
}
exports.default = new MatchController();
