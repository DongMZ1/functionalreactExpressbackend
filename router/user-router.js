const express = require('express');
const { check } = require('express-validator');

const {signup} = require('../controller/user-controller');

const router = express.Router();
router.post('/signup', signup);

module.exports = router;