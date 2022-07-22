const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { Op } = require('sequelize')
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
    .withMessage('Description must be 10 characters or more.'),
  check('price')
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage('Please provide a valid Price.'),
  handleValidationErrors
];



//Post a Review based on a Spot ID
router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    let id = req.user.id;
    const { review, stars } = req.body;
    const { spotId } = req.params
    const spotCheck = await Spot.findOne({
        where: { id: spotId }
    });
    if (!spotCheck) {
        const err = new Error(`Spot couldn't be found.`)
        err.status = 404
        return next(err)
    }
    const spotUserCheck = await Review.findOne({
        where: { userId: id, spotId: spotId}
    });
    if (spotUserCheck) {
        const err = new Error(`User already has a review for this spot.`)
        err.status = 403
        return next(err)
    };
    if (stars < 1 || stars > 5 || !Number(stars)) {
        const err = new Error(`Please enter a Star Rating between 1 and 5.`)
        err.status = 400
        return next(err)
    };
    if (review.length < 5) {
        const err = new Error(`Please enter a review with at least 5 Characters.`)
        err.status = 400
        return next(err)
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

    res.json(newReview);
});


// Add Images to a Spot by ID
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const { id } = req.user
    const { spotId } = req.params;
    const { url } = req.body;
    let spot = await Spot.findByPk(spotId);
    if(!spot) {
        const err = new Error(`Spot does not exist.`)
        err.status = 404
        return next(err)
    }
    if(spot.ownerId !== id) {
        const err = new Error(`Unauthorized: You are not the owner of this Spot.`)
        err.status = 403
        return next(err)
    }
    let imgcounts = await Image.findAll({
        where: { spotId: spotId }
    })

    let count = imgcounts.length
    if(count >= 10) {
        const err = new Error(`Image limit is 10.`)
        err.status = 400
        return next(err)
    }
    let result = await Image.create({
        url: url,
        spotId: spotId,
    })
    res.json(result)
});


// Get all a Spot's reviews by Spot Id
router.get('/:spotId/reviews', async (req, res, next) => {
    const { spotId } = req.params;
    let result = await Spot.findByPk(spotId, {
        include: [{ model: Review, include: { model: Image, as: 'Images' } } ]
    })
    if (!result) {
        const err = new Error(`Spot does not exist.`)
        err.status = 404
        return next(err)
    }


    res.json(result)
});


// Get all current user's Spots
router.get('/current', requireAuth, async (req, res) => {
    let id = req.user.id;
    let result = await Spot.findAll({
        where: { ownerId: id },
        include: { model: Image, as: 'Images' }
    })
    res.json(result)
});


// Edit a Spot to the current User by Spot ID
router.put('/:spotId', requireAuth, validateSpots, async (req, res, next) => {
    const { spotId } = req.params;
    const { address, city, state, country, name, description, price } = req.body
    let result = await Spot.findByPk(spotId, {
        include: [
            { model: User, as: 'Owner' }
        ]
    })
    if(result.Owner.id !== req.user.id) {
        const err = new Error(
            `Unauthorized`
            )
        err.status = 403
        return next(err)
    }
    if(!result) {
        const err = new Error(
            `Spot does not exist.`
            )
        err.status = 404
        return next(err)
    }

    if (address) result.address = address;
    if (city) result.city = city;
    if (state) result.state = state;
    if (country) result.country = country;
    if (name) result.name = name;
    if (description) result.description = description;
    if (price) result.price = price;

    await result.save()


    res.json({
        message: 'Spot updated successfully.',
        result
    })
});


// Get a Spot by Spot ID
router.get('/:spotId', async (req, res, next) => {
    const { spotId } = req.params;
    let result = await Spot.findByPk(spotId, {
        include: [
            { model: User, as: 'Owner' },
            { model: Image, as: 'Images' }
        ]
    })
    if(!result) {
        const err = new Error(
            `Spot does not exist.`
            )
        err.status = 404
        return next(err)
    }
    res.json(result)
});


// Create a Spot
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
});


//Get all Spots
router.get('/', async (req, res, next) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    let pagination = {};
    page = page === 0 ? 0 : parseInt(page)
    size = size === 0 ? 20 : parseInt(size)

    page = !Number(page) ? 0 : parseInt(page)
    size = !Number(size) ? 20 : parseInt(size)

    page = page === undefined ? 0 : parseInt(page)
    size = size === undefined ? 20 : parseInt(size)

    if (size >= 0 && page >= 0 && size <= 20) {
      pagination.limit = size
      pagination.offset = size * (page - 1)
    }
    if (size > 20) {
      pagination.limit = 20
      pagination.offset = size * (page - 1)
    }
    const checkNum = (query) => {
        if(!Number(query)){
            const err = new Error(
                `Please provide a valid number in query.`
                )
            err.status = 400
            return next(err)
        }
        return
    }

    if (page) { checkNum(page) };
    if (size) { checkNum(size) };
    if (minLat) { checkNum(minLat) };
    if (maxLat) { checkNum(maxLat) };
    if (minLng) { checkNum(minLng) };
    if (maxLng) { checkNum(maxLng) };
    if (minPrice) { checkNum(minPrice) };
    if (maxPrice) { checkNum(maxPrice) };

    const whereClause = {}
    if (minLat) whereClause.lat = { [Op.gte]: minLat };
    if (maxLat) whereClause.lat = { [Op.lte]: maxLat };
    if (minLat && maxLat) whereClause.lat = { [Op.between]: [minLat, maxLat] };
    if (minLng) whereClause.lng = { [Op.gte]: minLng };
    if (maxLng) whereClause.lng = { [Op.lte]: maxLng };
    if (minLng && maxLng) whereClause.lng = { [Op.between]: [minLng, maxLng] };
    if (minPrice) whereClause.price = { [Op.gte]: minPrice };
    if (maxPrice) whereClause.price = { [Op.lte]: maxPrice };
    if (minPrice && maxPrice) whereClause.price = { [Op.between]: [minPrice, maxPrice] };

    if (pagination.offset < 0) { pagination.offset = 0 }

    let result = await Spot.findAll({
        where: whereClause,
        ...pagination
    })
    size = result.length
    res.json({
        page,
        size,
        result
    })
});


// Delete Spot by Spot ID
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    let result = await Spot.findByPk(spotId)
    console.log(result)
    if(!result) {
        const err = new Error(
            `Spot does not exist.`
            )
        err.status = 404
        return next(err)
    }
    if(result.ownerId !== req.user.id) {
        const err = new Error(
            `Unauthorized.`
            )
        err.status = 403
        return next(err)
    }
    await result.destroy()

    res.json({ message: `Successfully Deleted Spot.` })
});


module.exports = router;
