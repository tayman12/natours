const Review = require('./../models/reviewModel');
const serviceFactory = require('./serviceFactory');

const addOne = serviceFactory.addOne(Review);
const getOne = serviceFactory.getOne(Review);
const deleteOne = serviceFactory.deleteOne(Review);
const getAll = serviceFactory.getAll(Review);
const updateOne = serviceFactory.updateOne(Review);

module.exports = { addOne, getOne, deleteOne, getAll, updateOne };
