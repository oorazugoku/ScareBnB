const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { Image } = require('../../db/models');



module.exports = router;
