const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: `./../../config.env` });

const mongoose = require('mongoose');

const Tour = require('./../../models/tourModel');

const deleteData = async () => {
  console.log('Deleting data');
  await Tour.deleteMany();
  console.log('Deleting data - done');
};

const createData = () => {
  console.log('Reading data');
  fs.readFile(`${__dirname}/tours-simple.json`, async (err, data) => {
    console.log('Reading data - done');
    const tours = JSON.parse(data);
    console.log('Parsing data - done ' + tours.length);

    try {
      console.log('Creating data');
      const response = await Tour.create(tours);
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
});
