const Review = require('./../models/reviewModel');
const factory = require('./serviceFactory');

exports.addOne = factory.addOne(Review);
exports.getOne = factory.getOne(Review);
exports.deleteOne = factory.deleteOne(Review);
exports.getAll = factory.getAll(Review);
exports.updateOne = factory.findAndUpdateOne(Review);
