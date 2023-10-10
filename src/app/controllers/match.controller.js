const mongoose = require('mongoose')

const { stairSchema } = require('../schemas')
const { CharacterModel, MapModel } = require('../models')

class MatchController {
    // [GET] /api/matches/:match/users/:user
    async get(req, res, next) {
        return res.json({ message: 'Hello matches' })
    }
}

module.exports = new MatchController()
