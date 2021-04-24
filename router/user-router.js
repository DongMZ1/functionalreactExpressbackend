const express = require("express");
const { check } = require("express-validator");
const Token = require('../models/token');

const {
  signup,
  login,
  addproducttocart,
  removeproductfromcart,
  selectitemonchange,
  createcheckout,
  getproductlist,
  localstorage,
  tester
} = require("../controller/user-controller");

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/addproducttocart", Token, addproducttocart);
router.post("/removeproductfromcart", Token, removeproductfromcart);
router.post("/selectitemonchange", Token, selectitemonchange);
router.post("/createcheckout", Token, createcheckout);
router.post("/getproductlist", Token, getproductlist);
router.post('/localstorage', Token, localstorage);
router.post('/tester', Token, tester);

module.exports = router;
