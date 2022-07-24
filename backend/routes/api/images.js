const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Image, Review, Spot } = require('../../db/models');


// Delete an Image by ID
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    let result = await Image.findByPk(imageId, {
        include: [{ model: Review }, { model: Spot }]
    })
    if(!result) {
        const err = new Error(`Image does not exist.`)
        err.status = 404
        err.errors = [err.message]
        return next(err)
    }
    if(result.Review) {
        if(result.Review.userId !== req.user.id) {
            const err = new Error(`Unauthorized.`)
            err.status = 403
            err.errors = [err.message]
            return next(err)
        }
    }
    if(result.Spot) {
        if(result.Spot.ownerId !== req.user.id) {
            const err = new Error(`Unauthorized.`)
            err.status = 403
            err.errors = [err.message]
            return next(err)
        }
    }
        await result.destroy()
    res.json({ message: `Successfully Deleted Image.` })
});


module.exports = router;
