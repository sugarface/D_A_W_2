var express = require('express');
var adminRestricted = require('../middlewares/adminRestricted');


var router = express.Router();

router.get('/adminControl', adminRestricted, (req, res, next) => {
    res.render('vwAdmin/adminControl');
  })

module.exports = router;