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
  .json({ email: existingUser.email, token: token, productcart: existingUser.productcart,
    productordering: existingUser.productordering, productfinished: existingUser.productfinished
  });

}




const addproducttocart = async (req, res, next) =>{
   const {title, email} = req.body;
   const existingproduct = await Product.findOne({title: title});
   const existinguser = await User.findOne({email: email});
   /*if user have already add product to cart, then simply increase number, else push the product to cart array*/
   let productincart = existinguser.productcart.filter(product => product.title === title);
   
   
   if(productincart.length === 0){
    existinguser.productcart.push(
      {
        title: existingproduct.title,
        number: 1,
        price: existingproduct.price,
        url: existingproduct.url
      }
    );
     
    await existinguser.save();
   }
 
   if(productincart.length > 0){
    productincart[0].number ++;
    await existinguser.save();
   }
   

   res
   .status(201)
   .json({existinguser});
   
}

const removeproductfromcart = async (req, res, next) =>{
  const {title, email} = req.body;
   const existingproduct = await Product.findOne({title: title});
   const existinguser = await User.findOne({email: email});
   let productincart = existinguser.productcart.filter(product => product.title === title);
   if(productincart[0].number > 1){
    productincart[0].number --;
    await existinguser.save();
   }
   if(productincart[0].number === 1){
    productincart[0].remove();
    await existinguser.save();
   }

   res
   .status(201)
   .json({existinguser});
}



exports.signup = signup;
exports.login = login;
exports.addproducttocart = addproducttocart;
exports.removeproductfromcart = removeproductfromcart;