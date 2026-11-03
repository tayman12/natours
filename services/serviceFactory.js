const APIFeatures = require('./../utils/apiFeatures');

const addOne = (model) => async (doc) => await model.create(doc);
const getOne = (model) => async (id) => await model.findById(id);
const deleteOne = (model) => async (id) => await model.findByIdAndDelete(id);

const getAll = (model) => async (queryParams) => {
  const features = new APIFeatures(model.find(), queryParams);
  features.filter().skipPopulation().sort().projection().pagination();
  return await features.query;
};

const updateOne = (model) => async (id, updatedFields) => {
  let doc = await model.findById(id);
  Object.assign(doc, updatedFields);
  return await doc.save();
};

const findAndUpdateOne = (model) => async (id, updatedFields) => {
  return await model.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true });
};

module.exports = { getAll, addOne, getOne, deleteOne, updateOne, findAndUpdateOne };
