const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

router.route('/top-5-cheap').get(tourController.aliasTopFiveCheap, tourController.getAll);

router.route('/stats').get(tourController.getTourStats);
router.route('/monthly-plan').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAll)
  .post(authController.protect, tourController.createOne);

router
  .route('/:id')
  .get(authController.protect, tourController.getOne)
  .patch(authController.protect, tourController.updateOne)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteOne);

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
