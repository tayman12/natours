const { readFile, writeFile } = require('../utils/fs');
const Tour = require('./../models/tourModel');

const getTours = async (queryParams) => {
  try {
    const queryObject = { ...queryParams };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((element) => delete queryObject[element]);

    console.log(queryParams, queryObject);

    return await Tour.find(queryObject);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const addTour = async (tour) => {
  try {
    return await Tour.create(tour);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getTourById = async (id) => {
  try {
    console.log(id);
    return await Tour.findById(id);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const updateTour = async (id, updatedFields) => {
  try {
    return await Tour.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const deleteTour = async (id) => {
  try {
    await Tour.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  getTours,
  addTour,
  getTourById,
  updateTour,
  deleteTour,
};
