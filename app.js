const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const writeFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const getTours = () => {
  const data = readFile(`${__dirname}/dev-data/data/tours-simple.json`);
  return data.then((data) => JSON.parse(data));
};

const addTour = async (tour) => {
  const tours = await getTours();
  const newTour = { id: tours[tours.length - 1].id + 1, ...tour };
  tours.push(newTour);
  await writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours));
  return newTour;
};

app.get('/api/v1/tours', async (req, res) => {
  const tours = await getTours();
  res.status(200).json({ status: 'success', results: tours.length, data: { tours: tours } });
});

app.get('/api/v1/tours/:id', async (req, res) => {
  const tours = await getTours();
  const tour = tours.find((t) => t.id === parseInt(req.params.id));
  if (!tour) res.status(404).json({ status: 'fail', message: 'Tour not found' });
  res.status(200).json({ status: 'success', data: { tour: tour } });
});

app.post('/api/v1/tours', async (req, res) => {
  const tour = await addTour(req.body);
  res.status(201).json({ status: 'success', data: { tour: tour } });
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
