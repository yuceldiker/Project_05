// const uuid = require('uuid/v4');
// using object structuring
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');

// with capital 'P', as it will be constructor function.
const Place = require('../models/place');
const User = require('../models/user');

// Middleware function
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    // findById is a static method.
    // Not used on the instance of Place. But directly on the Place constructor function.
    // findById does not return a Promise.
    // if a Promise is required as to be return, use => findById().exec()
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    );
    return next(error);
  }

  // if PLACE is null than return 404 error. Important: With the 'return' usage the "res.json({ place })" code line can be skipped.
  if (!place) {
    const error = new HttpError(
      'Could not find a place for the provided id.',
      404
    );
    return next(error);
  }
  // returning RESPONSE
  // "getters: true" => in DB'_id' will be 'id'.
  res.json({ place: place.toObject({ getters: true }) });
};

// Middleware function
const getPlacesByUserId = async (req, res, next) => {
  // router.get('/:pid', placesControllers.getPlaceById) -> req.params.uid = pid is from "router.get(':pid')
  const userId = req.params.uid; // { uid: 'u1' }

  // ORIGINAL CODE: let places;
  let userWithPlaces; // ALTERNATIVE CODE 
  try {
    // Mongoose find method
    // ORIGINAL CODE: places = await Place.find({ creator: userId });
    userWithPlaces = await User.findById(userId).populate('places'); // ALTERNATIVE CODE
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later.',
      500
    );
    return next(error);
  }

  // if PLACE is null than return 404 error. Important: With the 'return' usage the "res.json({ place })" code line can be skipped.
  // ORIGINAL CODE: if (!places || places.length === 0) {
    if (!userWithPlaces || userWithPlaces.places.length === 0) { // ALTERNATIVE CODE
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    );
  }

  // returning the RESPONSE
  // find({ creator: userId }) => returns an array so we use mapping.
  // ORIGINAL CODE: res.json({ places: places.map(place => place.toObject({ getters: true })) });
  res.json({ places: userWithPlaces.places.map(place => place.toObject({ getters: true })) });//ALTERNATIVE CODE
};

// Middleware function
const createPlace = async (req, res, next) => {
  // will check and return errors if there are any (defined in the router post in routes.js)
  const errors = validationResult(req);
  // if errors is not empty, then we have errors
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  // title, description etc are all properties...
  const { title, description, address, creator } = req.body;

  // getCoordsForAddress will return a promise so we can wait it

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error); // to quit the function we need to call 'return'
  }
 
  // instantiate our Place constructor.
  const createdPlace = new Place({
    title, //shorter version of => title: title
    description,
    address,
    location: coordinates,
    image:
      'https://beltur.istanbul/storage/media/albums/6/bgaleri17_1523351310.jpg',
    creator
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  console.log(user);

  // save() will handle storing a document in collection & database.
  // save() will also create the unique PlaceId automatically.
  // save() is also Promise this means we have async task.

  try {
    // storing place via session.
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // save() is a async method.
    await createdPlace.save({session: sess });
    // push() is a mongoose method that only adds the 'places' ID.
    user.places.push(createdPlace);
    // saving newly updated user.
    // Updated user should be part of our current session
    // that we are referring to.
    await user.save({ session: sess });
    // session commits the transaction.
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    // in case of an error code execution will stop.
    return next(error);
  }

  /// HTTP 201 mesajı döndürür.
  res.status(201).json({ place: createdPlace });
};

// Middleware function
const updatePlace = async (req, res, next) => {
  // will check and return errors if there are any (defined in the router post in routes.js)
  const errors = validationResult(req);
  // if errors is not empty, then we have errors
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place',
      500
    );
    return next(error);
  }

  // set the title to the one where we got it in the request body.
  place.title = title;

  // set the description to the one where we got it in the request body.
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  // returning the updatedPlace
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

// Middleware function
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    // populate() => refer to a document stored in another collection
    // and to work with data in that existing document of that other collection.
    // populate() => we need to refer to a specific property.
    // in our case it is 'creator' property because it contains "userID".
    place = await (await Place.findById(placeId)).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  // check if 'place' for the "provided id" is not found.
  if (!place) {
    const error = new HttpError('Could not find place for this id', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({session: sess});
    // 'pull' removes the place from the user.
    place.creator.places.pull(place);
    await place.creator.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }
  // we should send a response.
  res.status(200).json({ message: 'Deleted place.' });
};

// exports. sonrasındaki getPlaceById ismi farklı olabilirdi.
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
