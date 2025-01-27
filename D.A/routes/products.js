var express = require('express');
var productModel = require('../models/product.model');
var postModel = require('../models/post.models');
var writerRestricted = require('../middlewares/writerRestricted');
var adminRestricted = require('../middlewares/adminRestricted');

var router = express.Router();

router.get('/postmanage', adminRestricted, (req, res) => {
    postModel.all()
        .then(rows => {
            rows.forEach(element => {
                rows.forEach(element => {
                    if (element.TinhTrang == 1) {
                        element.TinhTrang = 'Đang chờ duyệt';
                    } else if (element.TinhTrang == 2) {
                        element.TinhTrang = 'Đã duyệt';
                    } else if (element.TinhTrang == 0) {
                        element.TinhTrang = 'Bị từ chối';
                    }
                });
            });
            res.render('vwProducts/postmanage', {
                baiviet: rows
            })
        })
        .catch(error => {
            res.render('error', { layout: false });
        });
})

router.get('/uppost', writerRestricted, (req, res, next) => {
    res.render('vwProducts/uppost');
})

router.get('/editpost/:id', writerRestricted, (req, res) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.render('vwProducts/editpost', {
            error: true
        })
        return;
    }
    postModel.single(id)
        .then(rows => {
            if (rows.length > 0) {
                rows.forEach(element => {
                    if (element.TinhTrang == 1) {
                        element.TinhTrang = 'Đang chờ duyệt';
                    } else if (element.TinhTrang == 2) {
                        element.TinhTrang = 'Đã duyệt';
                    } else if (element.TinhTrang == 0) {
                        element.TinhTrang = 'Bị từ chối';
                    }
                });
                res.render('vwProducts/editpost', {
                    error: false,
                    baiviet: rows[0]
                })
            } else {
                res.render('vwProducts/editpost', {
                    error: true
                });
            }
        });
})


router.post('/update', writerRestricted, (req, res) => {
    postModel.update(req.body).then(n => {
        res.redirect('/products');
    });
})

router.post('/delete', writerRestricted, (req, res) => {
    postModel.delete(+req.body.ProID).then(n => {
        res.redirect('/products');
    });
})

// newsDetail
router.get('/:idCat/:id', async(req, res, next) => {
    var id = req.params.id;
    var idCat = req.params.idCat
        // bo vao day chay song song
    const [List, sameList] = await Promise.all([
            productModel.single(id),
            productModel.sameList(idCat, id)
        ])
        //console.log(List);
    res.render('vwProducts/detail', {
        List,
        sameList
    });




})


module.exports = router;