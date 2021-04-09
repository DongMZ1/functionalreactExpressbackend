const express = require('express');
const { check } = require('express-validator');

const {signup, login} = require('../controller/user-controller');

const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;