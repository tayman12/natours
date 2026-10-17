const { readFile, writeFile } = require('../utils/fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

const getTours = async (queryParams) => {
  try {
    const features = new APIFeatures(Tour.find(), queryParams);
    features.filter().sort().projection().pagination();
    return await features.query;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const addTour = async (tour) => {
  try {
    return await Tour.create(tour);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getTourById = async (id) => {
  try {
    console.log(id);
    return await Tour.findById(id);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const updateTour = async (id, updatedFields) => {
  try {
    return await Tour.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const deleteTour = async (id) => {
  try {
    await Tour.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getTourStats = async () => {
  try {
    return await Tour.aggregate([
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
      {
        $match: { _id: { $ne: 'EASY' } },
      },
    ]);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getMonthlyPlan = async (year) => {
  try {
    return await Tour.aggregate([
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
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  getTours,
  addTour,
  getTourById,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
};
