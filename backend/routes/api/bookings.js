const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot, User } = require('../../db/models');


router.post('/spots/:spotId', async (req, res) => {
    const { userId, spotId, startDate, endDate } = req.body

    const result = await Booking.create({

        userId: userId,
        spotId: spotId,
        startDate: startDate,
        endDate: endDate
    })

    res.status(200)
    //   res.message('Success')
    res.json(result)
});



router.get('/', async (req, res) => {

    const result = await Booking.findAll()

    res.status(200)
    res.json(result)
});


module.exports = router;
