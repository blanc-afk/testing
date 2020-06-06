const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//Get User Schema
const User = require('../../models/User');

// @route   Post api/users
// @desc    Register Route
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      //See if user exists
      //can be like this or '{email:email}'
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      //Get user's gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mp',
      });
      //creating a new User instance
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      //Encrypt password

      //const salt = await bcrypt.genSalt(10)
      //user.password = await bcrypt.hash(password,salt);
      user.password = await bcrypt.hashSync(password, 10);
      //Create user
      await user.save();
      //Return JWT
      res.send('User Registered');
      res.send('User Route');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server.error');
    }
  }
);

module.exports = router;
