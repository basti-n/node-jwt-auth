const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { isUserValidationError, isDuplicateError } = require('../utils/error');
const { getMsFromDays, getSecFromDays } = require('../utils/date');
const {
  LOGIN_EMAIL_ERROR_MSG,
  LOGIN_PASSWORD_ERROR_MSG,
} = require('../constants/errors');
const { JWT_KEY } = require('../constants/authentication');

const handleError = (err) => {
  const errors = {};

  if (isDuplicateError(err)) {
    errors.duplicate = true;
    errors.email = 'Email is already taken.';
  }

  if (isUserValidationError(err)) {
    for (const errorProperty in err.errors) {
      const validationError = err.errors[errorProperty].properties;
      errors[validationError.path] = validationError.message;
    }
  }

  if (err.message === LOGIN_EMAIL_ERROR_MSG) {
    errors.email = err.message;
  }

  if (err.message === LOGIN_PASSWORD_ERROR_MSG) {
    errors.password = err.message;
  }

  return { errors };
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: getSecFromDays(3),
  });
};

const attachJwt = (res, id) => {
  const token = createToken(id);

  res.cookie(JWT_KEY, token, { maxAge: getMsFromDays(3), httpOnly: true });
};

const deleteJwt = (res) => {
  res.cookie(JWT_KEY, '', { maxAge: 1 });
};

module.exports.signup_get = (req, res) => {
  res.render('signup');
};

module.exports.login_get = (req, res) => {
  res.render('login');
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    attachJwt(res, user._id);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json(handleError(err));
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    attachJwt(res, user._id);
    res.status(200).json({ user: user._id });
  } catch (err) {
    res.status(400).json(handleError(err));
  }
};

module.exports.logout_get = (req, res) => {
  deleteJwt(res);
  res.redirect('/');
};
