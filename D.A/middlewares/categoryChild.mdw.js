var categoryModel = require('../models/category.model');

module.exports = (req, res, next) => {
    categoryModel.alllWithDetailsChild().then(rows => {
        res.locals.lcCategoriesChild = rows;
        next();
    });
}