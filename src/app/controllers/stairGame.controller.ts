import { request } from 'https'
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

class StairGameController {
    // [GET] api/matches/:match/stair
    get(req: any, res: any, next: any) {
        return res.json({ message: 'Welcome to Stair Gun Game' })
    }
}

export default new StairGameController()
