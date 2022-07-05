const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { Spot, Review } = require('../../db/models');



router.post('/:spotId/reviews/current', requireAuth, async (req, res) => {
    let id = req.user.id;
    const { review, stars } = req.body;
    const { spotId } = req.params

    const spotCheck = await Spot.findOne({
        where: { id: spotId }
    });
    if (!spotCheck) {
        res.status(404)
        return res.json({
            message: `Spot couldn't be found.`
        })
    }
    const spotUserCheck = await Review.findOne({
        where: { userId: id, spotId: spotId}
    });
    if (spotUserCheck) {
        res.status(404)
       return res.json({
            message: `User already has a review for this spot.`
        });
    };


    const oldReview = await Review.create({
        userId: id,
        spotId,
        review,
        stars
    });

    if (review) {
        oldReview.review = review;
    }
    if (stars) {
        oldReview.stars = stars;
    }
    res.json(oldReview);
});


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
