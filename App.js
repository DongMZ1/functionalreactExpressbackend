const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');
const product = require('./router/product-router');
const user = require('./router/user-router');


const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
  });
  app.use(express.static('image'));
  app.use('/api/user', user);
  app.use('/api/product', product);

  app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
  });

  app.use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
  });

  mongoose
  .connect(
    `mongodb+srv://Pikachu:518dmz518@mycluster.7q3bi.mongodb.net/firstfunctionalapp?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch(err => {
    console.log(err);
  });
