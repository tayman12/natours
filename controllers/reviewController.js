const reviewService = require('../services/reviewService');
const controllerFactory = require('./controllerFactory');

exports.getAll = (req, res, next) => {
  if (req.params.tourId) req.query.tour = req.params.tourId;
  controllerFactory.getAll(reviewService)(req, res, next);
};

exports.createOne = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  controllerFactory.createOne(reviewService)(req, res, next);
};

exports.getOne = controllerFactory.getOne(reviewService);
exports.updateOne = controllerFactory.updateOne(reviewService);
exports.deleteOne = controllerFactory.deleteOne(reviewService);
