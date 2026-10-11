const express = require('express');
const tourController = require('../controllers/tourController');

const getAllTours = async (req, res) => {
  const tours = await tourController.getTours();
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestedAt,
    data: { tours: tours },
  });
};

const getTourById = async (req, res) => {
  try {
    const tour = await tourController.getTourById(req.params.id);
    res.status(200).json({ status: 'success', data: { tour: tour } });
  } catch (error) {
    if (error.message === 'Tour not found') {
      res.status(404).json({ status: 'fail', message: 'Tour not found' });
    } else {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

const createTour = async (req, res) => {
  try {
    const tour = await tourController.addTour(req.body);
    res.status(201).json({ status: 'success', data: { tour: tour } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

const updateTourById = async (req, res) => {
  try {
    const tour = await tourController.updateTour(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: { tour: tour } });
  } catch (error) {
    if (error.message === 'Tour not found') {
      res.status(404).json({ status: 'fail', message: 'Tour not found' });
    } else {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

const deleteTourById = async (req, res) => {
  try {
    await tourController.deleteTour(req.params.id);
    res.status(204).json({ status: 'success' });
  } catch (error) {
    if (error.message === 'Tour not found') {
      res.status(404).json({ status: 'fail', message: 'Tour not found' });
    } else {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

const router = express.Router();

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTourById).patch(updateTourById).delete(deleteTourById);

module.exports = router;
