var express = require('express');
// var usersModel = require('../models/users.models');
var postModel = require('../models/post.models');
// var approved = require('../models/approved.models');
// var passport = require('passport');
// var editorDetail = require('../models/editorDetail.models');
var editorRestricted = require('../middlewares/editorRetricted');
var router = express.Router();
var limit = new Number();
limit = 6;

router.use(require('../middlewares/auth.mdw'));

router.get('/', editorRestricted, (req, res) => {
    postModel.all()
        .then(rows => {
            rows.forEach(element => {
                if (element.TinhTrang == 1) {
                    element.TinhTrang = 'Chưa được duyệt';
                } else if (element.TinhTrang == 2) {
                    element.TinhTrang = 'Đã duyệt';
                } else if (element.TinhTrang == 0) {
                    element.TinhTrang = 'Bị từ chối';
                }
            });
            res.render('vwEditor/index', {
                baiviet: rows
            })
        })
        .catch(error => {
            res.render('error', { layout: false });
        });
})

router.get('/editapproved/:id', editorRestricted, (req, res) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.render('vwEditor/edit', {
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
                res.render('vwEditor/edit', {
                    error: false,
                    baiviet: rows[0]
                })
            } else {
                res.render('vwEditor/edit', {
                    error: true
                });
            }
        });
})


router.post('/update', editorRestricted, (req, res) => {
    postModel.updateUser(req.body).then(n => {
        res.redirect('/editor');
    });
})

router.post('/delete', editorRestricted, (req, res) => {
    postModel.delete(+req.body.ProID).then(n => {
        res.redirect('/editor');
    });
})


module.exports = router;