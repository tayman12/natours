const userService = require('../services/userService');
const controllerFactory = require('./controllerFactory');

exports.getAll = controllerFactory.getAll(userService);
exports.createOne = controllerFactory.createOne(userService);
exports.getOne = controllerFactory.getOne(userService);
exports.updateOne = controllerFactory.updateOne(userService);
exports.deleteOne = controllerFactory.deleteOne(userService);

exports.updateMe = (req, res, next) => {
  req.params.id = req.user.id;
  controllerFactory.updateOne(userService)(req, res, next);
};

exports.deleteMe = (req, res, next) => {
  req.params.id = req.user.id;
  controllerFactory.deleteOne(userService)(req, res, next);
};
