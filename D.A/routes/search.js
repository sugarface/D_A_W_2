var express = require('express');
var productModel = require('../models/product.model');

var router = express.Router();


router.get('/', (req, res) => {
    var key = req.query.txtSearch;
    console.log(key);

    productModel.seachFullText(key)
        .then(rows => {
            if (rows.length > 0) {
                res.render('vwSearch/bySearch', {
                    error: false,
                    timkiem: rows,
                })
            } else {
                res.render('vwSearch/bySearch', {
                    error: true
                });
            }
        })
})


module.exports = router;