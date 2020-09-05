const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const {
  LOGIN_EMAIL_ERROR_MSG,
  LOGIN_PASSWORD_ERROR_MSG,
} = require('../constants/errors');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email address.'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email address.'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password.'],
    minlength: [6, 'Password must have atleast six characters.'],
  },
});

// Hash password
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static login
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error(LOGIN_EMAIL_ERROR_MSG);
  }

  const isAuthenticated = await bcrypt.compare(password, user.password);

  if (!isAuthenticated) {
    throw Error(LOGIN_PASSWORD_ERROR_MSG);
  }

  return user;
};

const User = mongoose.model('user', userSchema);

module.exports = User;
