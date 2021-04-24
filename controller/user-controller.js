const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const User = require('../Schema/user-schema');
const Product = require('../Schema/product-schema');
const uuid = require("uuid/v4");
const stripe = require('stripe')('sk_test_51IhmDWJmnqfDDj8MLYaEVcAhsTuVtI8D9t5RGik1QIYjGhMiwRObGXt09zQVAN9aJC9Rcuib19L1heiQXJbWCDmu00wmLXqaUw')

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

  const token = jwt.sign({email: email}, "secret_email", { expiresIn: '1h' });

  res
    .status(201)
    .json({ email: createdUser.email, password: createdUser.password, token: token});

}


const localstorage = async (req, res, next) =>{
  const {email} = req.user;
  existingUser = await User.findOne({ email: email });

  res
  .status(201)
  .json({productcart: existingUser.productcart,
    productordering: existingUser.productordering, productfinished: existingUser.productfinished,
    email: email
  });
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
      'User does not exist, please try again',
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

  const token = jwt.sign({email: email}, "secret_email", { expiresIn: '1h' });
  res
  .status(201)
  .json({ email: existingUser.email, token: token, productcart: existingUser.productcart,
    productordering: existingUser.productordering, productfinished: existingUser.productfinished
  });

}




const addproducttocart = async (req, res, next) =>{
   const {email} = req.user;
   const {title} = req.body;
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
        url: existingproduct.url,
        checked: true
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
   .json({data: existinguser.productcart});
   
}

const removeproductfromcart = async (req, res, next) =>{
  const {email} = req.user;
  const {title} = req.body;
   const existingproduct = await Product.findOne({title: title});
   const existinguser = await User.findOne({email: email});
   let productincart = existinguser.productcart.filter(product => product.title === title);
   if(productincart[0].number >= 1){
    productincart[0].number --;
    await existinguser.save();
   }
   if(productincart[0].number == 0){
    productincart[0].remove();
    await existinguser.save();
   }
  

   res
   .status(201)
   .json({data: existinguser.productcart});
}



const selectitemonchange = async (req, res, next) =>{
  const {email} = req.user;
  const {title, checked} = req.body;
  const existinguser = await User.findOne({email: email});
  let productincart = existinguser.productcart.filter(product => product.title === title);
  productincart[0].checked = checked;
  await existinguser.save();
  res
   .status(201)
   .json({data: existinguser.productcart});
}



const createcheckout = async (req, res, next) =>{
  const {email} = req.user;
  const {token, totalprice, productlist} = req.body;
  let existingUser = await User.findOne({ email: email });
  existingUser.productcart.filter(product => product.checked === true).map(product => {
    existingUser.productordering.push(
      {
        title: product.title,
        number: product.number,
        price: product.price,
        url: product.url,
      }
    )
    existingUser.productcart.remove(product);
  });

let charge;
  try {

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });
    const idempotencyKey = uuid();
    charge = await stripe.charges.create(
      {
        amount:  totalprice,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased the ${JSON.stringify(productlist)}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        },
         
      }, {
        idempotencyKey
      }
    );
  }catch(err){
    const error = new HttpError(err.message, 500);
    return next(error); 
  }
  await existingUser.save();
  res
   .status(201)
   .json({totalprice});
}

const getproductlist = async (req, res, next) =>{
  const {email} = req.user;
  const existingUser = await User.findOne({email: email});
  res.status(200).json(
    {
      productcart: existingUser.productcart,
      productordering: existingUser.productordering,
      productfinished: existingUser.productfinished
    }
  )
}

const tester = async (req, res, next) =>{
  const {email} = req.user;
  res.status(200).json(
    {email}
  )
}

exports.signup = signup;
exports.login = login;
exports.addproducttocart = addproducttocart;
exports.removeproductfromcart = removeproductfromcart;
exports.selectitemonchange= selectitemonchange;
exports.createcheckout = createcheckout;
exports.getproductlist = getproductlist;
exports.localstorage = localstorage;
exports.tester = tester;