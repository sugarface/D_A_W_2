var productModel = require('../models/product.model');

module.exports = (req, res, next) => {
    productModel.sameCat().then(rows => {
        res.locals.lcSameCategories = rows;
        next();
    });
}