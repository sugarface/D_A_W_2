var tagModel = require('../models/tag.model');

module.exports = (req, res, next) => {
    tagModel.all().then(rows => {
        res.locals.lcTags = rows;
        next();
    });
}