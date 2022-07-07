const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Image, Review, Spot } = require('../../db/models');


// Delete an Image by ID
router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params;
    let result = await Image.findByPk(imageId, {
        include: [{ model: Review }, { model: Spot }]
    })
    if(!result) {
        res.status(404)
        return res.json({
            message: `Image does not exist.`
        })
    }
    if(result.Review) {
        if(result.Review.userId !== req.user.id) {
            res.status(403)
            return res.json({
                message: `Unauthorized`
            })
        }
    }
    if(result.Spot) {
        if(result.Spot.ownerId !== req.user.id) {
            res.status(403)
            return res.json({
                message: `Unauthorized`
            })
        }
    }
        await result.destroy()
    res.json({ message: `Successfully Deleted Image.` })
});


module.exports = router;
