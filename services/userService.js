const User = require('./../models/userModel');
const serviceFactory = require('./serviceFactory');

exports.getOne = serviceFactory.getOne(User);
exports.getAll = serviceFactory.getAll(User);
exports.updateOne = serviceFactory.findAndUpdateOne(User);
exports.deleteOne = serviceFactory.deleteOne(User);
exports.deleteMe = (user) => serviceFactory.findAndUpdateOne(User)(user.id, { active: false });

const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj)
    .filter((el) => allowedFields.includes(el))
    .forEach((el) => (newObj[el] = obj[el]));
  return newObj;
};

exports.updateMe = async (user, updatedFields) => {
  if (updatedFields.password || updatedFields.passwordConfirm) {
    throw new AppError('This route is not for password updates. Please use /auth/update-my-password.');
  }

  const fields = filteredObj(updatedFields, 'name', 'email', 'photo');
  serviceFactory.findAndUpdateOne(User)(user.id, fields);
};
