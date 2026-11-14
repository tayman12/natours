const userService = require('../services/userService');
const factory = require('./controllerFactory');

exports.getAll = factory.getAll(userService);
exports.createOne = factory.createOne(userService);
exports.getOne = factory.getOne(userService);
exports.updateOne = factory.updateOne(userService);
exports.deleteOne = factory.deleteOne(userService);

exports.addUserId = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.addDeleteMeQuery = (req, res, next) => {
  req.query.id = req.user.id;
  next();
};

exports.validatePasswordFields = (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    throw new AppError('This route is not for password updates. Please use /auth/update-my-password.');
  }
  next();
};
