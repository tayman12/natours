const { readFile, writeFile } = require('../utils/fs');

const toursFilePath = `${__dirname}/../dev-data/data/tours-simple.json`;

const getTours = () => readFile(toursFilePath).then((data) => JSON.parse(data));
const writeAllTours = (tours) => writeFile(toursFilePath, JSON.stringify(tours));

const addTour = async (tour) => {
  const tours = await getTours();

  const newTour = { id: tours[tours.length - 1].id + 1, ...tour };
  tours.push(newTour);

  await writeAllTours(tours);

  return newTour;
};

const validateIdAndGetTour = async (req, res, next, id) => {
  const tours = await getTours();

  tour = tours.find((t) => t.id === parseInt(id));
  if (!tour) throw new Error('Tour not found');

  console.log(`Tour id is ${id}`);

  req.tour = tour;

  next();
};

const getTourById = (tour) => tour;

const updateTour = async (id, updatedFields) => {
  let tours = await getTours();

  tours = tours.filter((t) => t.id !== parseInt(id));
  const updatedTour = { ...req.tour, ...updatedFields };
  tours.push(updatedTour);

  writeAllTours(tours);

  return updatedTour;
};

const deleteTour = async (id) => {
  let tours = await getTours();
  tours = tours.filter((t) => t.id !== parseInt(id));

  await writeAllTours(tours);
};

module.exports = { validateIdAndGetTour, getTours, addTour, getTourById, updateTour, deleteTour };
