const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();


router.get('/user/getLogin', userController.getLogin);
router.post('/user/login', userController.login);
router.get('/user/getSignup', userController.getSignup);
router.post('/user/signup', userController.signup);

module.exports = router;
