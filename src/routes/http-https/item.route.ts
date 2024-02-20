import express from 'express'
const router = express.Router()
import { ItemController } from '../../app/controllers'

router.get('/', ItemController.getAll)
router.post('/buy', ItemController.buy)
router.post('/sell', ItemController.sellItem)

export default router
