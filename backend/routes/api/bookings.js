const express = require('express')
const router = express.Router();

const { Booking } = require('../../db/models');


router.post('/', async (req, res) => {
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
