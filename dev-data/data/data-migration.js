const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: `./../../config.env` });

const mongoose = require('mongoose');

const Review = require('./../../models/reviewModel');

const deleteData = async () => {
  console.log('Deleting data');
  await Review.deleteMany();
  console.log('Deleting data - done');
};

const createData = () => {
  console.log('Reading data');
  fs.readFile(`${__dirname}/reviews.json`, async (err, data) => {
    console.log('Reading data - done');
    const reviews = JSON.parse(data);
    console.log('Parsing data - done ' + reviews.length);

    try {
      console.log('Creating data');
      const response = await Review.create(reviews);
      console.log('Success ' + response.length);
    } catch (err) {
      console.log('******************* Failed:', err.message);
    }
  });
};

mongoose.connect(process.env.DATABASE_LOCAL).then(async (con) => {
  console.log('DB connection successful');
  await deleteData();
  await createData();
  exit();
});
