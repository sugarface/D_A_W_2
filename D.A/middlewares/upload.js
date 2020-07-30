var multer = require('multer');
var postModel = require('../models/post.models');
var writerRestricted = require('../middlewares/writerRestricted');
var adminRestricted = require('../middlewares/adminRestricted');
var editorReticted = require('../middlewares/editorRetricted');

var authmdw = require('./auth.mdw');
module.exports = function(app) {
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/images')
        },
        filename: function(req, file, cb) {
            cb(null, file.originalname)
        }
    });

    app.post('/products/uppost', adminRestricted, (req, res, next) => {
        multer({ storage }).single('file')(req, res, err => {
            if (err) {
                return res.json({
                    error: err.message
                });
            }
            var entity = req.body;
            entity.AnhDaiDien = '/public/images/' + req.file.filename;

            console.log(entity);


            postModel.add(entity, (err, post) => {
                if (err) return res.json({ error: err.message });
                console.log(post);
            });
            res.render('vwProducts/uppost', {
                success: 'Thêm thành công bài viết!'
            });
        })
    })

    app.post('/writer/add', writerRestricted, (req, res, next) => {
        multer({ storage }).single('file')(req, res, err => {
            if (err) {
                return res.json({
                    error: err.message
                });
            }
            var entity = req.body;
            entity.AnhDaiDien = '/public/images/' + req.file.filename;

            console.log(entity);


            postModel.add(entity, (err, post) => {
                if (err) return res.json({ error: err.message });
                console.log(post);
            });
            res.render('vwWriter/add', {
                success: 'Bài viết đang đã vào hàng đợi xét duyệt!'
            });
        })
    })

    app.post('/products/editpost/:id', adminRestricted, (req, res, next) => {
        multer({ storage }).single('file')(req, res, err => {
            if (err) {
                return res.json({
                    error: err.message
                });
            }
            console.log('meomeo');
            var id = req.params.id;
            var entity = req.body;
            if (req.file) {
                entity.AnhDaiDien = '/public/images/' + req.file.filename;
            } else if (!req.file) {
                delete entity.AnhDaiDien;
            }

            console.log(entity);


            postModel.update(id, entity, (err, post) => {
                if (err) return res.json({ error: err.message });
            }).then(n => {
                res.redirect('/products/postmanage');
            })
        })
    })

    app.post('/editor/editapproved/:id', editorReticted, (req, res, next) => {
        multer({ storage }).single('file')(req, res, err => {
            if (err) {
                return res.json({
                    error: err.message
                });
            }
            console.log('meomeo');
            var id = req.params.id;
            var entity = req.body;
            if (req.file) {
                entity.AnhDaiDien = '/public/images/' + req.file.filename;
            } else if (!req.file) {
                delete entity.AnhDaiDien;
            }

            console.log(entity);


            postModel.update(id, entity, (err, post) => {
                if (err) return res.json({ error: err.message });
            }).then(n => {
                res.redirect('/editor');
            })
        })
    })
}