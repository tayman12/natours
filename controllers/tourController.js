const tourService = require('../services/tourService');
const controllerFactory = require('./controllerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAll = controllerFactory.getAll(tourService);
exports.createOne = controllerFactory.createOne(tourService);
exports.getOne = controllerFactory.getOne(tourService);
exports.updateOne = controllerFactory.updateOne(tourService);
exports.deleteOne = controllerFactory.deleteOne(tourService);

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
