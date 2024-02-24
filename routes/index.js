const express = require('express');
const router = express.Router();

const productsRoutes = require('./productsRoute');

router.use('/products', productsRoutes);

module.exports = router;
