const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot } = require('../../db/models');
const router = express.Router();




// Get all Spots owned by current User
router.get('/current/spots', requireAuth, async (req, res) => {
  let id = req.user.id

  const result = await Spot.findAll({
    where: { ownerId: id }
  })
  res.json(result)
});


// Get the current User
router.get('/current', requireAuth, async (req, res) => {
  const { token } = req.cookies
  let user = req.user

  res.json({user, token})
});


// Get all Users
router.get('/', async (req, res) => {

  const result = await User.findAll()
  res.json(result)

});

module.exports = router;
