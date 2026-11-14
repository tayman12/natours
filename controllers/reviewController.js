const reviewService = require('../services/reviewService');
const factory = require('./controllerFactory');

exports.getAll = factory.getAll(reviewService);
exports.createOne = factory.createOne(reviewService);
exports.getOne = factory.getOne(reviewService);
exports.updateOne = factory.updateOne(reviewService);
exports.deleteOne = factory.deleteOne(reviewService);

exports.addTourIdAndUserId = (req, res, next) => {
  if (!req.body) req.body = {};

  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};
