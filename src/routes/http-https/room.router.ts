import express from 'express'
const router = express.Router()
const { RoomController } = require('../../app/controllers')

router.get('/', RoomController.getAll)

export default router
