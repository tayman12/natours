const { readFile, writeFile } = require('../utils/fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

const addTour = async (tour) => await Tour.create(tour);
const getTourById = async (id) => await Tour.findById(id);
const deleteTour = async (id) => await Tour.findByIdAndDelete(id);

const getTours = async (queryParams) => {
  const features = new APIFeatures(Tour.find(), queryParams);
  features.filter().sort().projection().pagination();
  return await features.query;
};

const updateTour = async (id, updatedFields) => {
  let tour = await Tour.findById(id);
  Object.assign(tour, updatedFields);
  return await tour.save();
};

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

module.exports = {
  getTours,
  addTour,
  getTourById,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
};
