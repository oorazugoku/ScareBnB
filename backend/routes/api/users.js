const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');








router.get('/current/spots', requireAuth, async (req, res) => {
  let id = req.user.id

  const user = await User.findOne({
    where: { id: id }
  })

  const result = await User.findAll({
    where: { ownerId: id },
    include: {
      model: Spot
    }
  })
  res.json(result)
  }
);






router.get('/', async (req, res) => {

  const result = await User.findAll()
  res.json(result)

  }
);

module.exports = router;
