const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../constants/authentication');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  const jwtToken = getTokenFromRequest(req);

  validateToken(jwtToken, handleTokenValidationResult, { res, next });
};

const checkUser = (req, res, next) => {
  const jwtToken = getTokenFromRequest(req);

  validateToken(jwtToken, injectUserInfoToView, { res, next });
};

function getTokenFromRequest(request, identifier = JWT_KEY) {
  return request.cookies && request.cookies[identifier];
}

function handleTokenValidationResult(err, decodedToken, { res, next }) {
  if (!decodedToken) {
    console.log('Login Token Missing: ', err.message);
    return res.redirect('/login');
  }
  if (err) {
    console.log('Error Validating Login Token: ', err.message);
    return res.redirect('login');
  }

  console.log('Token successfully validated: ', decodedToken);
  next();
}

async function injectUserInfoToView(err, token, { res, next }) {
  console.log({ token });
  if (!token || !token.id) {
    console.log('Login Token Missing: ', err.message);
    res.locals.user = null;
    return next();
  }
  if (err) {
    console.log('Error Validating Login Token: ', err.message);
    return next();
  }

  try {
    const user = await User.findById(token.id);
    console.log({ user });
    if (user) {
      res.locals.user = user;
      next();
    }
  } catch (error) {
    next();
  }
}

function validateToken(token, handler, { res, next }) {
  return jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) =>
    handler(err, decodedToken, { res, next })
  );
}

module.exports = { requireAuth, checkUser };
