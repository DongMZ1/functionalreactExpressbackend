const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../Schema/user-schema');
const Product = require('../Schema/product-schema');

const signup = async (req, res, next) =>{
  const {email, password } = req.body;

   let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  const createdUser = new User({
    email,
    password,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  const token = jwt.sign({email: email}, "secret_email");

  res
    .status(201)
    .json({ email: createdUser.email, password: createdUser.password, token: token});

}


const login = async (req, res, next) =>{

  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }


  if(password !== existingUser.password){
    const error = new HttpError(
      'Password is not valid, please try again',
      403
    );
    return next(error);
  }

  const token = jwt.sign({email: email}, "secret_email");
  res
  .status(201)
  .json({ email: existingUser.email, token: token});

}

const addproducttocart = async (req, res, next) =>{
   const {title, email} = req.body;
   const existingproduct = await Product.find({title: title});
   const existinguser = User.find({email: email});
   /*if user have already add product to cart, then simply increase number, else push the product to cart array*/

   let productinusercartindex = existinguser.productcart.indexOf({
     title: existingproduct.title
   });
   if(productinusercartindex === -1){
    existinguser.productcart.push(
      {
        title: existingproduct.title,
        number: 1,
        price: existingproduct.price,
        url: existingproduct.url
      }
    );
   }

   if(productinusercartindex !== -1){
        
   }

   res
   .status(201)
   .json({message: productinusercartindex});
   
}

const removeproductfromcart = async (req, res, next) =>{
  
}



exports.signup = signup;
exports.login = login;
exports.addproducttocart = addproducttocart;