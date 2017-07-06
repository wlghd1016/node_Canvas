'use strict';

// Module dependencies
const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();
const { wrap: async } = require('co');
const ImageFile = require('../models/imageFile.js');
// Models
// const ImageFile = mongoose.model( 'ImageFile' );

// Index
router.get('/', async(function* (req, res) {

    res.render( 'index' );

}));


module.exports = router;
