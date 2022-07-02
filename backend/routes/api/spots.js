const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { Spot } = require('../../db/models');



module.exports = router;
