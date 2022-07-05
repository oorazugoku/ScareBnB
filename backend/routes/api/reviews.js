const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { Image, Review } = require('../../db/models');




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
})

router.delete('/:reviewId', requireAuth, async (req, res) => {
    let id = req.user.id;
    const { reviewId } = req.params;

    let review = await Review.findOne({
        where: { id: reviewId }
    });
    if(!review) {
        res.status(404)
        res.json({
            message: `Review couldn't be found.`
        });
    };
    if(review.userId !== id) {
        res.status(404)
        res.json({
            message: `Sorry, you can only DELETE reviews that belong to the current Logged in User.`
        });
    };

    await review.destroy();

    res.status(200)
    res.json({
        message: "Successfully deleted"
      })
})


module.exports = router;
