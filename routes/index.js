const express = require('express');
const router = express.Router();

const productsRoutes = require('./productsRoute');
const productsCategoriesRoute = require('./productsCategoriesRoute');
const categoriesRoute = require('./categoriesRoute');

router.use('/products', productsRoutes);
router.use('/productsCategories', productsCategoriesRoute);
router.use('/categories', categoriesRoute);

module.exports = router;
