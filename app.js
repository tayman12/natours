const fs = require('fs');
const express = require('express');

const app = express();

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const getTours = () => {
  const data = readFile(`${__dirname}/dev-data/data/tours-simple.json`);
  return data.then((data) => JSON.parse(data));
};

app.get('/api/v1/tours', async (req, res) => {
  const tours = await getTours();
  res.status(200).json({ status: 'success', results: tours.length, data: { tours: tours } });
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
