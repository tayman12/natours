const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protect, reviewController.getAll)
  .post(authController.protect, authController.restrictTo('user', 'admin'), reviewController.createOne);

router
  .route('/:id')
  .get(authController.protect, reviewController.getOne)
  .patch(authController.protect, authController.restrictTo('user'), reviewController.updateOne)
  .delete(authController.protect, reviewController.deleteOne);

module.exports = router;
