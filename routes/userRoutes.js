const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/me')
  .get(userController.addUserId, userController.getOne)
  .patch(userController.addUserId, userController.validatePasswordFields, userController.updateOne)
  .delete(userController.addUserId, userController.addDeleteMeQuery, userController.updateOne);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAll);

router.route('/:id').get(userController.getOne).patch(userController.updateOne).delete(userController.deleteOne);

module.exports = router;
