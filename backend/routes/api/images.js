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
    let owner = result.Spot.ownerId
    res.json(result)
    if(owner !== req.user.id) {
        res.status(403)
        return res.json({
            message: `Unauthorized`,
            owner
        })
    }
    await result.destroy()
    res.json({ message: `Successfully Deleted Image.`, result})
});


module.exports = router;
