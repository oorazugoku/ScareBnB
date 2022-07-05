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
    if (stars < 1 || stars > 5) {
        res.status(404)
        return res.json({
            message: `Please enter a Star Rating between 1 and 5.`
        });
    };

    const newReview = await Review.create({
        userId: id,
        spotId,
        review,
        stars
    });
    let starTotal = 0
    const numOfReviews = await Review.findAll({
        where: { spotId: spotId}
    });
    numOfReviews.forEach(each => {
        starTotal += parseInt(each.stars)
    })
    let num = parseInt(spotCheck.numReviews)
    num++
    let starRating = (starTotal / num)
    await Spot.update(
        { numReviews: num, avgStarRating: starRating.toFixed(1) },
        { where: { id: spotId } }
        )
    // spotCheck.numReviews = spotCheck.numReviews + 1;

    res.json(newReview);
});



router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;
    let result = await Review.findAll({
        where: { spotId: spotId}
    })
    res.json(result)
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

router.get('/', async (req, res) => {
    let result = await Spot.findAll({})
    res.json(result)
})



module.exports = router;
