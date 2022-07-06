const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const sequelize = require('sequelize')
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, Review, Image, User } = require('../../db/models');
const user = require('../../db/models/user');

const validateSpots = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a valid Address.'),
    check('city')
      .exists({ checkFalsy: true })
      .isAlpha()
      .withMessage('Please provide a valid City.'),
    check('state')
      .exists({ checkFalsy: true })
      .isAlpha()
      .withMessage('Please provide a valid State.')
      .not()
      .isEmail()
      .isLength({ min: 2 })
      .withMessage('Please provide a valid State.'),
    check('country')
      .exists({ checkFalsy: true })
      .not()
      .isEmail()
      .withMessage('Please provide a valid Country.'),
    check('name')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Name must be 4 characters or more.'),
    check('description')
      .exists({ checkFalsy: true })
      .not()
      .isEmail()
      .withMessage('Please provide a Description.')
      .isLength({ min: 10 })
      .withMessage('Name must be 10 characters or more.'),
    check('price')
      .exists({ checkFalsy: true })
      .isNumeric()
      .withMessage('Please provide a valid Price.'),
    handleValidationErrors
  ];

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

router.post('/:spotId/images/current', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { url } = req.body;
    let spot = await Spot.findOne({
        where: { id: spotId }
    });
    if(!spot) {
        res.status(404)
        return res.json({
            message: `Spot does not exist.`
        })
    }
    let imgcounts = await Image.findAll({
        where: { spotId: spotId },
        attributes: {include: [[sequelize.fn('COUNT', sequelize.col('spotId')), 'imgCount']]}
    })
    let count = imgcounts[0].dataValues.imgCount
    console.log('-------------------', count)
    if(count >= 10) {
        res.status(400)
        return res.json({
            message: `Image limit is 10.`
        })
    }
    let result = await Image.create({
        url: url,
        spotId: spotId,
    })
    res.json(result)
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
        where: { ownerId: id },
        include: { model: Image }
    })
    res.json(result)
});


router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    let result = await Spot.findByPk(spotId, {
        include: [
            { model: User, as: 'Owner' },
            { model: Image, as: 'Images' }
        ]
    })
    if(!result) {
        res.status(404)
        return res.json({
            message: `Spot does not exist.`
        })
    }
    res.json(result)
});


router.post('/', requireAuth, validateSpots, async (req, res) => {
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
