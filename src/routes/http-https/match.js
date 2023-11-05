const express = require('express')
const router = express.Router()
const { MatchController } = require('../../app/controllers')

router.get('/:match/users/:user', MatchController.get)

module.exports = router
