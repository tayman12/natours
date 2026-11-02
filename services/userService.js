const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');

const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const getUserById = async (id) => await User.findById(id);
const deleteUser = async (id) => await User.findByIdAndDelete(id);

const getUsers = async (queryParams) => {
  const features = new APIFeatures(User.find(), queryParams);
  features.filter().sort().projection().pagination();
  return await features.query;
};

const updateUser = async (id, updatedFields) => {
  let user = await User.findById(id);
  Object.assign(user, updatedFields);
  return await user.save();
};

const updateMe = async (user, updatedFields) => {
  if (updatedFields.password || updatedFields.passwordConfirm) {
    throw new AppError('This route is not for password updates. Please use /auth/update-my-password.');
  }

  const fields = filteredObj(updatedFields, 'name', 'email', 'photo');
  return await User.findByIdAndUpdate(user.id, fields, { new: true, runValidators: true });
};

const deleteMe = async (user) => {
  return await User.findByIdAndUpdate(user.id, { active: false });
};

module.exports = { getUsers, getUserById, updateUser, deleteUser, updateMe, deleteMe };
