var productModel = require('../models/product.model');

module.exports = (req, res, next) => {
    productModel.latestNews().then(rows => {
        res.locals.lcProducts = rows;
        next();
    });
}