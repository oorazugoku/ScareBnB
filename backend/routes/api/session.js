const express = require('express')
const router = express.Router();
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
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


// V or username.'),
//   check('passworalidate login info
// const validateLogin = [
//   check('credential')
//     .exists({ checkFalsy: true })
//     .notEmpty()
//     .withMessage('Please provide a valid emaild')
//     .exists({ checkFalsy: true })
//     .withMessage('Please provide a password.'),
//   handleValidationErrors
// ];


// Restore session user
router.get('/', restoreUser, (req, res) => {
    const { user } = req;
    if (user) {
      return res.json({
        user: user.toSafeObject()
      });
    } else return res.json({});
  }
);


// User Login
router.post('/login', async (req, res, next) => {

  const { credential, password } = req.body;

  if (!credential) {
    const err = new Error('Please Enter a valid username or email.')
    err.title = 'Login Failed'
    err.status = 400
    return next(err)
  }
  if (!password) {
    const err = new Error('Please Enter a valid password.')
    err.title = 'Login Failed'
    err.status = 400
    return next(err)
  }

  const user = await User.login({ credential, password });

  if (!user) {
    const err = new Error('Invalid Username and Password.')
    err.title = 'Login Failed'
    err.status = 400
    return next(err)
  }
  let token = await setTokenCookie(res, user);
  return res.json({
    user, token
  });
});



// User Signup
router.post('/signup', validateSignup, async (req, res, next) => {

  const { firstName, lastName, email, password, username } = req.body;

  const emailCheck = await User.findOne({
    where: {email: email}
  })
  const userNameCheck = await User.findOne({
    where: {username: username}
  })
  if (userNameCheck) {
    const err = new Error('Sorry, this username already exists')
    err.status = 403
    return next(err)
  }
  if (emailCheck) {
    const err = new Error('Sorry, this email already exists')
    err.status = 403
    return next(err)
  }

  const user = await User.signup({ firstName, lastName, email, username, password });

  let token = await setTokenCookie(res, user);

  return res.json({
    user, token
  });
});


// // User Login
// router.post('/login', validateLogin, async (req, res, next) => {

//     const { credential, password } = req.body;
//     const user = await User.login({ credential, password });

//     if (!user) {
//       const err = new Error('Login failed');
//       err.status = 401;
//       err.title = 'Login failed';
//       err.errors = ['The provided credentials were invalid.'];
//       return next(err);
//     }

//     await setTokenCookie(res, user);
//     return res.json({ user });
// });


// Delete Token-Cookie
router.delete('/logout', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);



module.exports = router;
