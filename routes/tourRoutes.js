const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

router.route('/top-5-cheap').get(tourController.aliasTopFiveCheap, tourController.getAll);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);

router.route('/stats').get(tourController.getTourStats);

router
  .route('/monthly-plan')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );

router
  .route('/')
  .get(tourController.getAll)
  .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createOne);

router
  .route('/:id')
  .get(tourController.getOne)
  .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.updateOne)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteOne);

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
