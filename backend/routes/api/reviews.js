const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const sequelize = require('sequelize')
const { Image, Review, Spot } = require('../../db/models');




router.put('/:reviewId/current', requireAuth, async (req, res) => {
    let id = req.user.id;
    const { review, stars } = req.body;

    const oldReview = await Review.findOne({
    where: { userId: id }
    });

    if (review) {
        oldReview.review = review;
    }
    if (stars) {
        oldReview.stars = stars;
    }
    res.json(oldReview);
});


router.get('/current/', requireAuth, async (req, res) => {
  let id = req.user.id
  const result = await Review.findAll({
      where: { userId: id }
  })
  res.json(result)
});

router.get('/', async (req, res) => {
    let result = await Review.findAll({})
    res.json(result)
});

router.delete('/:reviewId', requireAuth, async (req, res) => {
    let id = req.user.id;
    const { reviewId } = req.params;

    let review = await Review.findOne({
        where: { id: reviewId }
    });
    if(!review) {
        res.status(404)
        return res.json({
            message: `Review couldn't be found.`
        });
    };
    if(review.userId !== id) {
        res.status(404)
       return res.json({
            message: `Sorry, you can only DELETE reviews that belong to the current Logged in User.`
        });
    };

    // let avgStars = await Review.findAll({
    //     where: { spotId: review.spotId },
    //     attributes: {include: [[sequelize.fn('AVG', sequelize.col('stars')), 'AvgStars']]}
    // })
    // console.log(avgStars[0].dataValues.AvgStars)

    const spot = await Spot.findOne({
        where: {id: review.spotId}
    })
    await review.destroy();

    let starTotal = 0
    const numOfReviews = await Review.findAll({
        where: { spotId: spot.id }
    });
    if(numOfReviews) {
        numOfReviews.forEach(each => {
            starTotal += parseInt(each.stars)
        })
        let num = parseInt(spot.numReviews)
        if(num > 0) {
            num--
        }
        if(num === 0) {
            await Spot.update(
                { numReviews: 0, avgStarRating: 0 },
                { where: { id: review.spotId } }
                )
            } else {
                let starRating = (starTotal / num)
                await Spot.update(
                    { numReviews: num, avgStarRating: starRating.toFixed(1) },
                    { where: { id: spot.id } }
                    )
            }
    } else {
        await Spot.update(
            { numReviews: 0, avgStarRating: 0 },
            { where: { id: spot.id } }
            )
    }


    res.status(200)
    res.json({
        message: "Successfully deleted"
      })
})


module.exports = router;
