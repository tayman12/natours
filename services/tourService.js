const Tour = require('./../models/tourModel');
const factory = require('./serviceFactory');

exports.addOne = factory.addOne(Tour);
exports.getOne = factory.getOne(Tour, { path: 'reviews' });
exports.getAll = factory.getAll(Tour);
exports.updateOne = factory.updateOne(Tour);
exports.deleteOne = factory.deleteOne(Tour);

exports.getTourStats = async () =>
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

exports.getMonthlyPlan = async (year) =>
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

exports.getToursWithin = async (distance, latlng, unit) => {
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng) throw new Error('Please provide latitude and longitude in the format lat,lng.');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  console.log(distance, lat, lng, unit, radius);
  return await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } });
};
