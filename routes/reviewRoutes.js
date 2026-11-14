const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.addTourIdAndUserId, reviewController.getAll)
  .post(authController.restrictTo('user', 'admin'), reviewController.addTourIdAndUserId, reviewController.createOne);

router
  .route('/:id')
  .get(reviewController.getOne)
  .patch(authController.restrictTo('admin', 'user'), reviewController.updateOne)
  .delete(authController.restrictTo('admin', 'user'), reviewController.deleteOne);

module.exports = router;
