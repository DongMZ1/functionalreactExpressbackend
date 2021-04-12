const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const {registerproduct, getallproduct} = require('../controller/product-controller');

router.post('/register', registerproduct);
router.post('/getallproduct', getallproduct);

module.exports = router;