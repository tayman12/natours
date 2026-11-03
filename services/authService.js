const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const singToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN, algorithm: 'HS512' });

const verifyToken = async (token) => {
  try {
    return await promisify(jwt.verify)(token, process.env.JWT_SECRET, { algorithms: 'HS512' });
  } catch (error) {
    // console.error(error.message);

    throw new AppError(`Invalid token, please log in again!!`, 401);
  }
};

const extractToken = (authHeader) => {
  if (authHeader && authHeader.startsWith('Bearer')) {
    return authHeader.slice(7);
  } else {
    throw new AppError('You are not logged in. Please log in first!!', 401);
  }
};

exports.signup = async (user) => {
  const newUser = await User.create(user);
  const token = singToken(newUser._id);

  return { user: newUser, token: token };
};

exports.signin = async (email, password) => {
  if (!email || !password) throw new AppError('Please provide email and password', 400);

  const user = await User.findOne({ email: email }).select('+password');
  if (!user) throw new AppError('Invalid email or password', 401);

  const correctPassword = await user.correctPassword(password, user.password);
  if (!correctPassword) throw new AppError('Invalid email or password', 401);

  return singToken(user._id);
};

exports.protect = async (authHeader) => {
  const token = extractToken(authHeader);
  const payload = await verifyToken(token);
  const user = await User.findById(payload.id);

  if (!user) throw new AppError(`The user belonging to this token does no longer exist`, 401);
  if (user.changedPasswordAfter(new Date(payload.iat * 1000)))
    throw new AppError('User recently changed password! Please log in again.', 401);

  return user;
};

exports.restrictTo = (allowedRoles, user) => {
  if (!allowedRoles.includes(user.role)) {
    throw new AppError('You do not have permission to perform this action', 403);
  }
};

exports.forgetPassword = async (email, baseURL) => {
  let user = await User.findOne({ email: email });
  if (!user) throw new AppError('User does not exist', 404);

  const resetToken = user.createPasswordResetToken();
  user = await user.save({ validateBeforeSave: false });
  console.log({ resetToken });

  const resetURL = `${baseURL}/api/v1/auth/reset-password/${resetToken}`;

  const options = {
    email: user.email,
    subject: 'Your password reset token (valid for 10 min)',
    message: `Forgot your password? Submit a PATCH request with new password and passwordConfirm to : ${resetURL}\n If you did not forget your password, please ignore this email.`,
  };

  try {
    await sendEmail(options);
  } catch (error) {
    console.log({ error });
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    throw new AppError('There was an error sending the email. Please try again later!', 500);
  }
};

exports.resetPassword = async (token, newPassword, passwordConfirm) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: new Date() },
  });

  if (!user) throw new AppError('This token is invalid or has expired', 400);

  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  return singToken(user._id);
};

exports.updatePassword = async (userId, currentPassword, newPassword, passwordConfirm) => {
  const user = await User.findById(userId).select('+password');

  console.log({ user, currentPassword, newPassword, passwordConfirm });

  const correctPassword = await user.correctPassword(currentPassword, user.password);
  if (!correctPassword) throw new AppError('Your current password is wrong.', 401);

  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  return singToken(user._id);
};
