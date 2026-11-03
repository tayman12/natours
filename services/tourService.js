const Tour = require('./../models/tourModel');
const serviceFactory = require('./serviceFactory');

const addOne = serviceFactory.addOne(Tour);
const getOne = serviceFactory.getOne(Tour);
const getAll = serviceFactory.getAll(Tour);
const updateOne = serviceFactory.updateOne(Tour);
const deleteOne = serviceFactory.deleteOne(Tour);

const getTourStats = async () =>
  await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        count: { $count: {} },
      },
    },
    {
      $sort: {
        avgPrice: -1,
      },
    },
  ]);

const getMonthlyPlan = async (year) =>
  await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStart: { $count: {} },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { numToursStart: -1 } },
    { $limit: 6 },
  ]);

module.exports = { getAll, addOne, getOne, updateOne, deleteOne, getTourStats, getMonthlyPlan };
