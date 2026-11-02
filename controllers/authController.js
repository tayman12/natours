const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

sendToken = (res, status, token, user) => {
  res.cookie('jwt', token, {
    maxAge: process.env.JWT_EXPIRES_IN,
    secure: true,
    httpOnly: true,
  });

  if (user && user.password) user.password = undefined;

  res.status(status).json({ status: 'success', token: token, data: { user } });
};

exports.signup = catchAsync(async (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  };

  const newUser = await authService.signup(user);
  sendToken(res, 201, newUser.token, newUser.user);
});

exports.signin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const token = await authService.signin(email, password);
  sendToken(res, 200, token, null);
});

exports.protect = catchAsync(async (req, res, next) => {
  const user = await authService.protect(req.headers.authorization);
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    authService.restrictTo(roles, req.user);
    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  await authService.forgetPassword(req.body.email, `${req.protocol}://${req.get('host')}`);

  res.status(200).json({ status: 'success', message: 'Token sent to email!' });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const token = await authService.resetPassword(req.params.token, req.body.password, req.body.passwordConfirm);

  sendToken(res, 200, token, null);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const token = await authService.updatePassword(
    req.user.id,
    req.body.currentPassword,
    req.body.newPassword,
    req.body.passwordConfirm,
  );

  sendToken(res, 200, token, null);
});
