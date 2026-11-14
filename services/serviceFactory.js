const APIFeatures = require('./../utils/apiFeatures');

const addOne = (model) => async (doc) => await model.create(doc);
const deleteOne = (model) => async (id) => await model.findByIdAndDelete(id);

const getOne = (model, populateOptions) => async (id) => {
  const query = model.findById(id);
  if (populateOptions) {
    query.populate(populateOptions);
  }
  return await query;
};

const getAll = (model) => async (queryParams) => {
  const features = new APIFeatures(model.find(), queryParams);
  features.filter().skipPopulation().sort().projection().pagination();
  // console.log(await features.query.explain());
  return await features.query;
};

const updateOne = (model) => async (id, updatedFields) => {
  let doc = await model.findById(id);
  Object.assign(doc, updatedFields);
  return await doc.save();
};

const findAndUpdateOne = (model) => async (id, updatedFields) => {
  return await model.findByIdAndUpdate(id, updatedFields, { returnDocument: 'after', runValidators: true });
};

module.exports = { getAll, addOne, getOne, deleteOne, updateOne, findAndUpdateOne };
