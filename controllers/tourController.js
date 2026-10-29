const express = require('express');
const tourService = require('../services/tourService');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasTopFiveCheap = (req, res, next) => {
  const params = new URLSearchParams(req.query);

  params.set('limit', '5');
  params.set('sort', '-ratingsAverage,price');
  params.set('fields', 'name,price,ratingsAverage,summary,difficulty');

  req.url = `${req.path}?${params.toString()}`;

  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const tours = await tourService.getTours(req.query);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestedAt,
    data: { tours: tours },
  });
});

exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await tourService.getTourById(req.params.id);

  if (!tour) return next(new AppError('No Tour exist with this ID', 404));

  res.status(200).json({ status: 'success', data: { tour: tour } });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const tour = await tourService.addTour(req.body);
  res.status(201).json({ status: 'success', data: { tour: tour } });
});

exports.updateTourById = catchAsync(async (req, res, next) => {
  const tour = await tourService.updateTour(req.params.id, req.body);

  if (!tour) return next(new AppError('No Tour exist with this ID', 404));

  res.status(200).json({ status: 'success', data: { tour: tour } });
});

exports.deleteTourById = catchAsync(async (req, res, next) => {
  const tour = await tourService.deleteTour(req.params.id);

  if (!tour) return next(new AppError('No Tour exist with this ID', 404));

  res.status(204).json({ status: 'success' });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await tourService.getTourStats();
  res.status(200).json({ status: 'success', data: { stats: stats } });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const plan = await tourService.getMonthlyPlan(req.query.year * 1);
  res
    .status(200)
    .json({ status: 'success', results: plan.length, data: { plan: plan } });
});
