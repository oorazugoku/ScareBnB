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
  check('firstName')
    .exists({ checkFalsy: true })
    .isAlpha()
    .withMessage('First Name must be valid Characters.')
    .not()
    .isEmail()
    .withMessage('First Name cannot be an email.')
    .isLength({ min: 2 })
    .withMessage('Please provide a valid First Name with at least 2 characters.'),
  check('lastName')
    .exists({ checkFalsy: true })
    .isAlpha()
    .withMessage('Last Name must be valid Characters.')
    .not()
    .isEmail()
    .isLength({ min: 2 })
    .withMessage('Please provide a valid Last Name with at least 2 characters.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.')
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
      model: Spot,
      where: { ownerId: user.id }
    }
  })

  await requireAuth(req)

  res.json(result)

  }
);

router.post('/login', async (req, res) => {

  const { email, password, username } = req.body;
  let credential
  if (email) {
    credential = email
  }
  if (username) {
    credential = username
  }

  if (!credential) {
    res.status(400)
    res.json({
      message: 'Please Enter a valid username or email.'
    })
  }
  if (!password) {
    res.status(400)
    res.json({
      message: 'Please Enter a valid password.'
    })
  }

  const user = await User.login({ credential, password });

  if (!user) {
    new Error('Invalide Username and Password.');
    res.status(401);
    res.json({
      message: 'Invalid Username and Password.'
    })
  }

  let token = await setTokenCookie(res, user);

  return res.json({
    user,token
  });
}
);




// Sign up endpoint
router.post('/signup', validateSignup, async (req, res) => {

      const { firstName, lastName, email, password, username } = req.body;

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

      let token = await setTokenCookie(res, user);

      return res.json({
        user,token
      });
    }
  );

router.get('/', async (req, res) => {

  const result = await User.findAll()
  res.json(result)

  }
);



module.exports = router;
