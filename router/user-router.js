const express = require('express');
const { check } = require('express-validator');

const userController = require('../controller/user-controller');

const router = express.Router();
router.post('/signup', userController.signup);

module.exports = router;