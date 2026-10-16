const fs = require('fs');
const axios = require('axios');

const url = 'http://localhost:8080/api/v1/tours';

fs.readFile(`${__dirname}/dev-data/data/tours-simple.json`, (err, data) => {
  const tours = JSON.parse(data);

  tours.forEach((tour) => {
    axios
      .post(url, tour)
      .then((response) => {
        console.log('Success' + response.data);
      })
      .catch((err) => {
        console.log('******************* Failed:', err.message);
      });
  });
});
