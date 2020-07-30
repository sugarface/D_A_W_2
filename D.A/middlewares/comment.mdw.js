var productModel = require('../models/product.model');

module.exports = (req, res, next) => {

    productModel.allComment().then(rows => {
        res.locals.lcComments = rows;
        next();

    });
}