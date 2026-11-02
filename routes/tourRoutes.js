const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/top-5-cheap').get(tourController.aliasTopFiveCheap, tourController.getAllTours);

router.route('/stats').get(tourController.getTourStats);
router.route('/monthly-plan').get(tourController.getMonthlyPlan);

router.route('/').get(authController.protect, tourController.getAllTours).post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTourById)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTourById);

module.exports = router;
