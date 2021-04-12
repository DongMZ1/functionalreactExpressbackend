const Product = require('../Schema/product-schema');
const HttpError = require('../models/http-error');

const registerproduct = async (req, res, next) =>{
  const {title, text, price, url} = req.body;

  const createproduct = new Product({
      title,
      text,
      price,
      url
  });

  try {
    await createproduct.save();
  } catch (err) {
    const error = new HttpError(
      'create product fail, please try again',
      403
    );
    return next(error);
  }

  res.
  status(201).
  json({title: createproduct.title, text: createproduct.text, price: createproduct.price, url: createproduct.url});
}

const getallproduct = async (req, res, next) =>{
  const allproduct = await Product.find({});
  res.status(201).json(allproduct);
};

exports.registerproduct = registerproduct;
exports.getallproduct = getallproduct;