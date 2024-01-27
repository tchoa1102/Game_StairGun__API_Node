import express from 'express'
const router = express.Router()
const { StairGameController } = require('../../app/controllers')

router.get('/', StairGameController.get)

export default router
