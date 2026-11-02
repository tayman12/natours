const userService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userService.getUsers(req.query);
  res.status(200).json({
    status: 'success',
    results: users.length,
    requestedAt: req.requestedAt,
    data: { users: users },
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.id);

  if (!user) return next(new AppError('No User exist with this ID', 404));

  res.status(200).json({ status: 'success', data: { user: user } });
});

exports.updateUserById = catchAsync(async (req, res, next) => {
  const user = await userService.updateUser(req.params.id, req.body);

  if (!user) return next(new AppError('No User exist with this ID', 404));

  res.status(200).json({ status: 'success', data: { user: user } });
});

exports.deleteUserById = catchAsync(async (req, res, next) => {
  const user = await userService.deleteUser(req.params.id);

  if (!user) return next(new AppError('No User exist with this ID', 404));

  res.status(204).json({ status: 'success' });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const user = await userService.updateMe(req.user, req.body);

  res.status(200).json({ status: 'success', data: { user: user } });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await userService.deleteMe(req.user);

  res.status(204).json({ status: 'success' });
});
