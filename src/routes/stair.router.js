const express = require('express')
const router = express.Router()
const { StairGameController } = require('../app/controllers')

router.get('/', StairGameController.get)

module.exports = router
