const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: `./../../config.env` });

const mongoose = require('mongoose');

const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

const deleteData = async () => {
  console.log('Deleting data');
  await Tour.deleteMany();
  await User.deleteMany();
  await Review.deleteMany();
  console.log('Deleting data - done');
};

const createData = async () => {
  console.log('Reading data');

  const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
  const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
  const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

  console.log('Reading data - done ' + reviews.length);

  try {
    console.log('Creating data');

    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);

    console.log('Success');
  } catch (err) {
    console.log('Failed:', err.message);
  }
};

mongoose.connect(process.env.DATABASE_LOCAL).then(async (con) => {
  console.log('DB connection successful');
  await deleteData();
  await createData();
  process.exit();
});
