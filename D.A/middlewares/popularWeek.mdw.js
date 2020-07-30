var productModel = require('../models/product.model');

module.exports = (req, res, next) => {
    productModel.popularNews().then(rows => {
        res.locals.lcPopularWeek = rows;
        next();
    });
}