const tourService = require('../services/tourService');
const factory = require('./controllerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAll = factory.getAll(tourService);
exports.createOne = factory.createOne(tourService);
exports.getOne = factory.getOne(tourService);
exports.updateOne = factory.updateOne(tourService);
exports.deleteOne = factory.deleteOne(tourService);

exports.aliasTopFiveCheap = (req, res, next) => {
  const params = new URLSearchParams(req.query);

  params.set('limit', '5');
  params.set('sort', '-ratingsAverage,price');
  params.set('fields', 'name,price,ratingsAverage,summary,difficulty');

  req.url = `${req.path}?${params.toString()}`;

  next();
};

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await tourService.getTourStats();
  res.status(200).json({ status: 'success', data: { stats: stats } });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const plan = await tourService.getMonthlyPlan(req.query.year * 1);
  res.status(200).json({ status: 'success', results: plan.length, data: { plan: plan } });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;

  const tours = await tourService.getToursWithin(distance, latlng, unit);
  res.status(200).json({ status: 'success', results: tours.length, data: { tours: tours } });
});
