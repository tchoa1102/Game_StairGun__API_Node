import mongoose from 'mongoose'

const { stairSchema } = require('../schemas')
const { CharacterModel, MapModel } = require('../models')

class MatchController {
    // [GET] /api/matches/:match/users/:user
    async get(req: any, res: any, next: any) {
        return res.json({ message: 'Hello matches' })
    }
}

export default new MatchController()
