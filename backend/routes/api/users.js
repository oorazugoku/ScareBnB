const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];





router.get('/current/spots', requireAuth, async (req, res) => {

  const { token } = req.cookies;

  if (!token) {
    res.json({
      "message": "Authentication required",
      "statusCode": 401
    })
  }


  const user = await User.findOne({
    where: { token: token }
  })


  const result = await User.findAll({
    where: {token: token},
    include: {
      model: Spot
    }
  })

  await requireAuth(req)

  res.json(result)

  }
);

// Sign up endpoint
router.post('/signup', validateSignup, async (req, res) => {

      const { email, password, username } = req.body;

      const emailCheck = await User.findOne({
        where: {email: email}
      })

      if (emailCheck) {
        res.status(403)
        res.json({
          message: 'Sorry, this email already exists'
        })
      }

      const user = await User.signup({ firstName, lastName, email, username, password });

      await setTokenCookie(res, user);

      return res.json({
        user
      });
    }
  );

router.get('/', async (req, res) => {

  const result = await User.findAll()
  res.json(result)

  }
);



module.exports = router;
