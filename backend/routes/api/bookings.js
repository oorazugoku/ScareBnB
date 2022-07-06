const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot, User } = require('../../db/models');


router.post('/spots/:spotId', requireAuth, async (req, res) => {
    let { startDate, endDate } = req.body
    const { id } = req.user
    const { spotId } = req.params

    startDate = new Date(startDate)
    endDate = new Date(endDate)

    const spotCheck = await Spot.findByPk(spotId, {
        include: { model: Booking }
    });
    if(!spotCheck) {
        res.status(404)
        return res.json({
            message: `Spot does not exist.`
        })
    }
    if(spotCheck.ownerId === id) {
        res.status(401)
        return res.json({
            message: `Unauthorized: Cannot Reserve a Spot that you own.`
        })
    }
    let startNum = startDate.getTime()
    let endNum = endDate.getTime()
    let check = false
    let proof
    if(spotCheck.Bookings.length) {
        spotCheck.Bookings.forEach(each => {
            if(startNum <= each.startDate.getTime() && endNum >= each.endDate.getTime()) {
                check = true
                proof = each
            }
            if(startNum >= each.startDate.getTime() && startNum <= each.endDate.getTime()) {
                check = true
                proof = each
            }
            if(endNum >= each.startDate.getTime() && endNum <= each.endDate.getTime()) {
                check = true
                proof = each
            }
        });
    }
    if(check == true) {
        res.status(401)
        return res.json({
            message: `This Booking already exists inside Start and End date.`,
            proof
        })
    }

    const result = await Booking.create({
        userId: id,
        spotId: spotId,
        startDate: startDate,
        endDate: endDate
    })

    res.status(200)
    res.json({
        message: `Resevation Successful!`,
        result
    })
});



router.get('/', async (req, res) => {

    const result = await Booking.findAll()

    res.status(200)
    res.json(result)
});


module.exports = router;
