import express from 'express'
const router = express.Router()
import { CardController } from '../../app/controllers'

router.get('/', CardController.getAll)

export default router
