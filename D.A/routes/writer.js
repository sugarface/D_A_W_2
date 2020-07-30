var express = require('express');
var writerRestricted = require('../middlewares/writerRestricted');
var post = require('../models/post.models');
var limit = new Number();
limit = 6;

var router = express.Router();
router.get('/add', writerRestricted, (req, res, next) => {
    res.render('vwWriter/add');
})

router.get('/loadpost', writerRestricted, (req, res, next) => {
    var id = req.user._id;
    console.log(id);
    var page = req.query.page || 1;
    if (page < 1) page = 1;
    var start_offset = (page - 1) * limit;
    Promise.all([post.GetPostByUser(start_offset, id),
        post.countGetPostByUser(id)
    ]).then(([post, Ctotal]) => {
        var postchunks = [];
        var size = 2;
        for (var i = 0; i < post.length; i += size) {
            postchunks.push(post.slice(i, i + size));
        }
        var total = new Number();
        total = Ctotal;
        var nPages = new Number();
        nPages = Math.floor(total / limit);
        if (total % limit >= 0)
            nPages = nPages + 1;
        var page_numbers = [];
        for (var i = 1; i <= nPages; i++) {
            page_numbers.push({
                value: i,
                active: i === +page
            })
        }
        res.render('vwWriter/loadpost', {
            baiviet: postchunks,
            page_numbers
        });
    }).catch();

})
module.exports = router;