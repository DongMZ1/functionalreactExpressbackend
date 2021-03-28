const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../Schema/user-schema');

const signup = async (req, res, next) =>{

    return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
}

exports.signup = signup;