var productModel = require('../models/product.model');

module.exports = (req, res, next) => {
    productModel.latestViews().then(rows => {
        res.locals.lcProductsview = rows;
        next();
    });
}