const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot, User } = require('../../db/models');


// Reserve a Booking by Spot ID
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
    let check = false
    let proof
    if(spotCheck.Bookings.length) {
        spotCheck.Bookings.forEach(each => {
            if(startDate <= each.startDate && endDate >= each.endDate) {
                check = true
                proof = each
            };
            if(startDate >= each.startDate && startDate <= each.endDate) {
                check = true
                proof = each
            };
            if(endDate >= each.startDate && endDate <= each.endDate) {
                check = true
                proof = each
            };
        });
    }
    if(check == true) {
        res.status(403)
        return res.json({
            message: `This Booking already exists inside Start and End date.`,
            proof
        });
    };

    const result = await Booking.create({
        userId: id,
        spotId: spotId,
        startDate: startDate,
        endDate: endDate
    });

    res.status(200);
    res.json({
        message: `Resevation Successful!`,
        result
    });
});


// Get all Bookings for a Spot by Spot ID
router.get('/spots/:spotId', requireAuth, async (req, res) => {
    const { id } = req.user;
    const { spotId } = req.params;
    let result = await Spot.findByPk(spotId);
    if(!result) {
        res.status(404);
        return res.json({
            message: `Spot does not exist.`
        });
    }
    if(result.ownerId !== id) {
        result = await Booking.scope(['nonOwner']).findByPk(spotId);
    } else {
        result = await Booking.findByPk(spotId, {
            include: { model: User }
        });
    }

        size = result.length
    res.status(200);
    res.json({
        size,
        result
    });
});


// Get all Bookings by current User
router.get('/current', requireAuth, async (req, res) => {
    const { id } = req.user
    const result = await Spot.findAll({
        include: {
            model: Booking,
            where: { userId: id }
        }
    });
    size = result.length
    res.status(200);
    res.json({
        size,
        result
    });
});


module.exports = router;
