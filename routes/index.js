const express = require('express');
const router = express.Router();

const productsRoutes = require('./productsRoute');
const categoriesRoute = require('./categoriesRoute');

router.use('/products', productsRoutes);
router.use('/categories', categoriesRoute);

module.exports = router;
