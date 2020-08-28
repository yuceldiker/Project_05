const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');


const getUsers = async (req, res, next) => {
  let users;
  try {
    // Same code as using the below code => const users = User.find({}, 'email name');
    // Which means exclude 'password' and bring all other fields.
    // Find() is a async task.
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.', 500
    );
    return next(error);
  }
  // using 'map' because find() method runs an array
  // so we cannot convert this into a default javascript object.
  // using toObject() we convert 'user' into a javascript object.
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  // will check and return errors if there are any (defined in the router post in routes.js)
  const errors = validationResult(req);
  // if errors is not empty, then we have errors
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  // extracting name, email, password.
  // will create a new user so extract data from the incoming body
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  // creating new user
  const createdUser = new User({
    name,
    email,
    image:
      'https://beltur.istanbul/storage/media/albums/6/bgaleri17_1523351310.jpg',
    password,
    // We have to change our places because the starting value
    // for the places will be an empty area.
    // Once we add a place this will automatically be added.
    places: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up user failed, please try again.',
      500
    );
    // in case of an error code execution will stop.
    return next(error);
  }
  // converting mongoose object 'createdUser' to Javascript object
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  res.json({ message: 'Logged in!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
