const express = require('express');
const { check } = require('express-validator');

const {signup, login, addproducttocart, removeproductfromcart} = require('../controller/user-controller');

const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/addproducttocart', addproducttocart);
router.post('/removeproductfromcart', removeproductfromcart);

module.exports = router;