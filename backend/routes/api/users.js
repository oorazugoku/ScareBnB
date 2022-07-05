const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');







router.get('/current/spots', requireAuth, async (req, res) => {
  let id = req.user.id

  const result = await Spot.findAll({
    where: { ownerId: id }
  })
  res.json(result)
}
);



router.get('/current', requireAuth, async (req, res) => {
  const { token } = req.cookies
  let user = req.user

  res.json({user, token})
});



router.get('/', async (req, res) => {

  const result = await User.findAll()
  res.json(result)

  }
);

module.exports = router;
