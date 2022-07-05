const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { Spot } = require('../../db/models');






router.get('/current', requireAuth, async (req, res) => {
    let id = req.user.id;

    let result = await Spot.findAll({
        where: { ownerId: id }
    })

    res.json(result)
})

router.post('/', requireAuth, async (req, res) => {
    let id = req.user.id;

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    let result = await Spot.create({
        ownerId: id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    res.json(result)
})




module.exports = router;
