const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


const validateSignup = [
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First name is required.'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last name is required.'),
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with atleast 4 characters.'),
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

router.post('/', [validateSignup], async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body;

    const errors = {};

    const foundUsername = await User.findOne({
        where: {
            username: username
        }
    });

    const foundEmail = await User.findOne({
        where: {
            email: email
        }
    });

    if (foundUsername) {
        errors.username = "User with that username already exists";
    }
    if (foundEmail) {
        errors.email = "User with that email already exists"
    }

    if (errors.username || errors.email) {
        const err = Error("User already exists.");
        err.errors = errors;
        err.status = 500;
        err.title = "User already exists.";
        return next(err);
    }

    const hashedPassword = bcrypt.hashSync(password);

    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
    };

    setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});




module.exports = router;
