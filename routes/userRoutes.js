const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(authController.protect, userController.getAll);

router
  .route('/me')
  .patch(authController.protect, userController.updateMe)
  .delete(authController.protect, userController.deleteMe);

router
  .route('/:id')
  .get(authController.protect, userController.getOne)
  .patch(authController.protect, userController.updateOne)
  .delete(authController.protect, userController.deleteOne);

module.exports = router;
