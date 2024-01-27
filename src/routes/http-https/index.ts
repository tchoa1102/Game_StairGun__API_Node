import stair from './stair.router'
import match from './match'
import room from './room.router'
import card from './card.route'
import item from './item.route'
import middlewares from '../../middlewares'
import { AuthController } from '../../app/controllers'

function routes(app: any) {
    // app.use
    app.use('/api', middlewares.decodeToken, middlewares.findUser)
    app.get('/api/auth/login', (req: any, res: any, next: any) => {
        return res.json({ message: 'Success logging' })
    })
    app.use('/api/rooms', room)
    app.use('/api/auth/load', AuthController.load)
    app.use('/api/cards', card)
    app.use('/api/items', item)
    // app.use('/api/matches/:match/stair', stair)
    // app.use('/api/matches', match)
}

export default routes
