const User = require('./../models/userModel');
const serviceFactory = require('./serviceFactory');

const getOne = serviceFactory.getOne(User);
const getAll = serviceFactory.getAll(User);
const updateOne = serviceFactory.findAndUpdateOne(User);
const deleteOne = serviceFactory.deleteOne(User);
const deleteMe = (user) => serviceFactory.findAndUpdateOne(User)(user.id, { active: false });

const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj)
    .filter((el) => allowedFields.includes(el))
    .forEach((el) => (newObj[el] = obj[el]));
  return newObj;
};

const updateMe = async (user, updatedFields) => {
  if (updatedFields.password || updatedFields.passwordConfirm) {
    throw new AppError('This route is not for password updates. Please use /auth/update-my-password.');
  }

  const fields = filteredObj(updatedFields, 'name', 'email', 'photo');
  serviceFactory.findAndUpdateOne(User)(user.id, fields);
};

module.exports = { getAll, getOne, updateOne, deleteOne, updateMe, deleteMe };
