var express = require('express');
var productModel = require('../models/product.model');
//Nhớ gọi kết nối CSDL

var router = express.Router();


router.get('/', async function(req, res) {
    res.render("qlTag");
});

router.post('/insert', async function(req, res) {

    let insert = await chuyenmuccha.create({

        //Xử lý thêm xuống CSDL
        // lấy thông tin từ thẻ input dùng req.boy.xxx
        //lấy thông tin từ đường link thì dùng req.query.xxx (ví dụ: qlTag?id=1 dùng câu lệnh đó sẽ lấy được id là 1)
        //gán trong js (ví dụ id:req.body.xxx)

    })

    //Reload lại trang với CSDL mới
    return res.redirect('/qlTag')
})

router.post('/delete', async function(req, res) {

    let insert = await chuyenmuccha.detroy({

        //Xử lý xóa CSDL

    })

    //Reload lại trang với CSDL mới
    return res.redirect('/qlTag')
})


module.exports = router;