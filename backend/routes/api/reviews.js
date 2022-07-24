const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const sequelize = require('sequelize')
const { Image, Review, Spot, User } = require('../../db/models');


// Add Images to a Review by Review ID
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    const { id } = req.user

    let review = await Review.findOne({
        where: { id: reviewId}
    });

    if(!review) {
        const err = new Error(`Review does not exist.`)
        err.status = 404
        err.errors = [err.message]
        return next(err)
    }
    if(review.userId !== id) {
        const err = new Error(`Unauthorized: This review does not belong to you.`)
        err.status = 403
        err.errors = [err.message]
        return next(err)

    }
    let imgcounts = await Image.findAll({
        where: { reviewId: reviewId }
    });
    let count = imgcounts.length
    if(count >= 10) {
        const err = new Error(`Image limit is 10.`)
        err.status = 400
        err.errors = [err.message]
        return next(err)
    }
    let result = await Image.create({
        url,
        reviewId
    })

    res.json(result)
});


// Edit a Review by Review ID
router.put('/:reviewId', requireAuth, async (req, res, next) => {
    let id = req.user.id;
    const { review, stars } = req.body;
    const { reviewId } = req.params;
    const oldReview = await Review.findByPk(reviewId);
    if(!oldReview) {
        const err = new Error(`Review does not exist.`)
        err.status = 404
        err.errors = [err.message]
        return next(err)
    }
    if(id !== oldReview.userId) {
        const err = new Error(`Unauthorized: This review does not belong to you.`)
        err.status = 403
        err.errors = [err.message]
        return next(err)
    }
    if (review) {
        oldReview.review = review;
    }
    if (stars) {
        oldReview.stars = stars;
    }

    await oldReview.save()
    res.json({message: `Edit Successful`, oldReview});
});


// Get current User's reviews
router.get('/current', requireAuth, async (req, res) => {
  let id = req.user.id
  const result = await User.findAll({
      where: { id: id },
      include: { model: Review, include: [{ model: Spot }, { model: Image }] }
  })
  res.json(result)
});



// Delete a Review by Review ID
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    let id = req.user.id;
    const { reviewId } = req.params;

    let review = await Review.findOne({
        where: { id: reviewId }
    });
    if(!review) {
        const err = new Error(`Review couldn't be found.`)
        err.status = 404
        err.errors = [err.message]
        return next(err)
    };
    if(review.userId !== id) {
        const err = new Error(`Sorry, you can only DELETE reviews that belong to the current Logged in User.`)
        err.status = 404
        err.errors = [err.message]
        return next(err)
    };
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
