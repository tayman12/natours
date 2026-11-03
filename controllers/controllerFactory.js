const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAll = (service) =>
  catchAsync(async (req, res, next) => {
    const documents = await service.getAll(req.query);
    res.status(200).json({ status: 'success', results: documents.length, data: { documents: documents } });
  });

exports.getOne = (service) =>
  catchAsync(async (req, res, next) => {
    const document = await service.getOne(req.params.id);

    if (!document) return next(new AppError('No document exist with this id', 404));

    res.status(200).json({ status: 'success', data: { document: document } });
  });

exports.createOne = (service) =>
  catchAsync(async (req, res, next) => {
    const document = await service.addOne(req.body);
    res.status(201).json({ status: 'success', data: { document: document } });
  });

exports.updateOne = (service) =>
  catchAsync(async (req, res, next) => {
    const document = await service.updateOne(req.params.id, req.body);
    if (!document) return next(new AppError('No document exist with this id', 404));
    res.status(200).json({ status: 'success', data: { document: document } });
  });

exports.deleteOne = (service) =>
  catchAsync(async (req, res, next) => {
    const document = await service.deleteOne(req.params.id);
    if (!document) return next(new AppError('No document exist with this id', 404));
    res.status(204).json({ status: 'success' });
  });
