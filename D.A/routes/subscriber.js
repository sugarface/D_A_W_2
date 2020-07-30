var express = require('express');
var subscriberModel = require('../models/subscriber.model');
var config = require('../config/default.json');
var adminRestricted = require('../middlewares/adminRestricted');
var moment = require('moment');

var router = express.Router();

router.get('/', adminRestricted, (req, res) => {
    subscriberModel.all()
        .then(rows => {
            res.render('vwSubscriber/index', {
                qlSubscriber: rows
            })
        })
        .catch(error => {
            res.render('error', { layout: false });
        });
})

router.get('/edit/:id', adminRestricted, (req, res, next) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.render('vwSubscriber/edit', { error: true });
        return;
    }

    subscriberModel.single(id)
        .then(rows => {
            if (rows.length > 0) {
                var qlSubscriber = rows[0];
                res.render('vwSubscriber/edit', {
                    error: false,
                    qlSubscriber
                });
            } else {
                res.render('vwSubscriber/edit', {
                    error: true
                });
            }
        }).catch(next);
})

router.post('/update', adminRestricted, (req, res, next) => {
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    // var id = req.params.id;
    var entity = req.body;

    entity.ThoiHan = dob;
    // entity.ID = id;

    delete entity.dob;
    console.log(entity);

    subscriberModel.update(entity, entity.ID).then(id => {
        return res.redirect('/subscriber');
    })

})


module.exports = router;