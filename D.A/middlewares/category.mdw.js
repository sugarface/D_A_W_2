var categoryModel = require('../models/category.model');

module.exports = (req, res, next) => {
    categoryModel.alllWithDetails().then(rows => {
        res.locals.lcCategories = rows;
        next();
    });
}