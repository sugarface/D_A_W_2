var express = require('express');
var productModel = require('../models/product.model');
var tagModel = require('../models/tag.model');
var config = require('../config/default.json');
var adminRestricted = require('../middlewares/adminRestricted');

var router = express.Router();

router.get('/', adminRestricted, (req, res) => {
    tagModel.all()
        .then(rows => {
            res.render('vwTags/index', {
                qltags: rows
            })
        })
        .catch(error => {
            res.render('error', { layout: false });
        });
})

router.get('/add', adminRestricted, (req, res, next) => {
    res.render('vwTags/add');
})

router.post('/add', adminRestricted, (req, res, next) => {
    tagModel.add(req.body).then(id => {
        res.render('vwTags/add');
    }).catch(next);
})

router.get('/edit/:id', adminRestricted, (req, res, next) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.render('vwTags/edit', { error: true });
        return;
    }

    tagModel.single(id)
        .then(rows => {
            if (rows.length > 0) {
                var qltags = rows[0];
                res.render('vwTags/edit', {
                    error: false,
                    qltags
                });
            } else {
                res.render('vwTags/edit', {
                    error: true
                });
            }
        }).catch(next);
})

router.post('/update', adminRestricted, (req, res, next) => {
    tagModel.update(req.body).then(n => {
        res.redirect('/tag');
    }).catch(next);

})

router.post('/delete', adminRestricted, (req, res, next) => {
    tagModel.delete(+req.body.TagID).then(n => {
        res.redirect('/tag');
    }).catch(next);
})

router.get('/:id/products', (req, res, next) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.render('vwProducts/byTag', { error: true });
        return;
    }

    var limit = config.paginate.default;
    var page = +req.query.page || 1;
    if (page < 1) page = 1;
    var start_offset = (page - 1) * limit;

    Promise.all([
        productModel.countByTag(id),
        productModel.pageByTag(id, start_offset)
    ]).then(([nRows, rows]) => {


        for (var c of res.locals.lcTags) {
            if (c.TagID === +id) {
                c.active = true;
            }

        }

        var total = nRows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0)
            nPages++;

        var page_numbers = [];
        for (i = 1; i <= nPages; i++) {
            page_numbers.push({
                value: i,
                active: i === +page
            })
        }


        res.render('vwProducts/byTag', {
            error: false,
            empty: rows.length === 0,
            tags: rows,
            page_numbers
        })
    }).catch(next)

})


module.exports = router;