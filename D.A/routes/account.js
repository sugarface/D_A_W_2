var express = require('express');
var bcrypt = require('bcrypt');
var moment = require('moment');
var passport = require('passport');
var nodemailer = require('nodemailer');
var userModel = require('../models/user.model');
var restricted = require('../middlewares/restricted');
var adminRestricted = require('../middlewares/adminRestricted');
// var profileModel = require('../models/profile.model');

var router = express.Router();

router.get('/register', (req, res, next) => {
    res.render('vwAccount/register');
})

router.post('/register', (req, res, next) => {
    var entity = req.body;

    //băm mk
    var saltRounds = 10;
    var hash = bcrypt.hashSync(req.body.password, saltRounds);

    // format date of birth
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

    entity.MatKhau = hash;
    entity.NgaySinh = dob;
    entity.PhanQuyen = 0;

    delete entity.password;
    delete entity.confirm;
    delete entity.dob;

    userModel.add(entity).then(id => {
        res.redirect('/account/login');
    })
})

router.get('/is-available', (req, res, next) => {
    var user = req.query.user;
    var mail = req.query.mail;
    var pass = req.query.pass;

    userModel.singleByUserName(user).then(rows => {
        if (rows.length > 0)
            res.json(false);
        else res.json(true);
    })

    userModel.singleByEmail(mail).then(rows => {
        if (rows.length > 0)
            res.json(false);
        else res.json(true);
    })

    userModel.singleByPass(pass).then(rows => {
        if (rows.length > 0) {


            var saltRounds = 10;
            var hash = bcrypt.hashSync(pass, saltRounds);

            entity.MatKhau = hash;

            delete entity.email;
            delete entity.password;

            res.json(false);
        } else {
            res.json(true);
        }

    })



})

router.get('/login', (req, res, next) => {
    res.render('vwAccount/login', { layout: false });
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);

        if (!user) {
            return res.render('vwAccount/login', {
                layout: false,
                err_message: info.message
            })
        }

        var retUrl = req.query.retUrl || '/';
        req.logIn(user, err => {
            if (err)
                return next(err);

            return res.redirect(retUrl);
        });
    })(req, res, next);
})

router.post('/logout', restricted, (req, res, next) => {
    req.logout();
    res.redirect('/');
})

router.get('/profile/:id', restricted, (req, res, next) => {
    var entity = req.body;
    var id = req.params.id;

    if (isNaN(id)) {
        res.render('vwAccount/profile', { error: true });
        return;
    }

    userModel.single(id)
        .then(rows => {
            if (rows[0].PhanQuyen == 1) {
                rows[0].PhanQuyen = "Admin";
            } else if (rows[0].PhanQuyen == 0) {
                rows[0].PhanQuyen = "Độc giả";
            } else if (rows[0].PhanQuyen == 2) {
                rows[0].PhanQuyen = "Tác giả";
            } else if (rows[0].PhanQuyen == 3) {
                rows[0].PhanQuyen = "Người kiểm duyệt";
            }
            if (rows.length > 0) {
                res.render('vwAccount/profile', {
                    error: false,
                    profile: rows[0]
                });
            } else {
                res.render('vwAccount/profile', {
                    error: true
                });
            }
        }).catch(next);

})

router.get('/editprofile/:id', (req, res, next) => {
    var id = req.params.id;

    if (isNaN(id)) {
        res.render('vwAccount/editprofile', { error: true });
        return;
    }

    userModel.single(id)
        .then(rows => {
            if (rows.length > 0) {
                res.render('vwAccount/editprofile', {
                    error: false,
                    editprofile: rows[0]

                });
            } else {
                res.render('vwAccount/editprofile', {
                    error: true
                });
            }
        }).catch(next);

})

router.post('/editprofile/:id', restricted, (req, res, next) => {
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var id = req.params.id;
    var entity = req.body;

    entity.NgaySinh = dob;
    entity.ID = id;

    delete entity.dob;
    console.log(entity);

    userModel.update(entity, entity.ID).then(id => {
        return res.redirect(`/account/profile/${entity.ID}`);
    })

})

router.get('/editpassword/:id', restricted, (req, res, next) => {
    res.render('vwAccount/editpassword', { error: true });
})

router.post('/editpassword/:id', (req, res, next) => {
    var id = req.params.id;
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);

        if (!user) {
            return res.render('vwAccount/editpassword', {
                err_message: info.message
            })
        }
        //
        var saltRounds = 10;
        var hash = bcrypt.hashSync(req.body.newpassword, saltRounds);
        var entity = req.body;
        entity.MatKhau = hash;

        delete entity.username;
        delete entity.password;
        delete entity.newpassword;
        delete entity.confirm;

        userModel.update(entity, id).then(id => {
            var retUrl = req.query.retUrl || '/';
            req.logIn(user, err => {
                if (err)
                    return next(err);
                return res.redirect(retUrl);
            });
        });
    })(req, res, next);

})


router.get('/forgotpassword', (req, res, next) => {
    res.render('vwAccount/forgotpassword');
})

router.post('/forgotpassword', (req, res, next) => {
    var entity = req.body
        // tao password ngau nhien khi forgot
    var iteration = 0;
    var password = "";
    var randomNumber;
    var special = false;
    while (iteration < 6) {
        randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
        if (!special) {
            if ((randomNumber >= 33) && (randomNumber <= 47)) { continue; }
            if ((randomNumber >= 58) && (randomNumber <= 64)) { continue; }
            if ((randomNumber >= 91) && (randomNumber <= 96)) { continue; }
            if ((randomNumber >= 123) && (randomNumber <= 126)) { continue; }
        }
        iteration++;
        password += String.fromCharCode(randomNumber);
    }
    // gui mail
    userModel.confirmEmail(entity.Email).then(rows => {
        if (rows.length > 0) {
            var user = rows[0];
            var nodemailer = require('nodemailer');
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'boyaogiac123@gmail.com',
                    pass: 'phat2611999'
                }
            });
            var mailOptions = {
                from: '"BESTNEW" <foo@blurdybloop.com>', // sender address
                to: req.body.Email, // list of receivers
                subject: '[BESTNEW] Thông tin đăng nhập tài khoản', // Subject line
                text: 'Reset Password', // plaintext body
                html: `<div>
            <p>Kính chào bạn ` + rows[0].Name + `</p>
            <p>Thông tin đăng nhập mới của bạn trên BESTNEW là:</p>
            <p>Tên đăng nhập: ` + rows[0].NguoiDung + ` <br> Mật khẩu:  ` + password + `</p>
            <p>Trân trọng,</p>
            <p>----------<br>
            </div>`
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    return console.log("loi");
                } else {
                    console.log('Message sent: ' + info.response);
                    res.redirect('/');
                }
            });

            // update mat khau vua tao

            var saltRounds = 10;
            var hash = bcrypt.hashSync(password, saltRounds);

            entity.MatKhau = hash;

            delete entity.Email;
            userModel.update(entity, user.ID).then(id => {
                return res.redirect('/account/login');
            })
        }
        ///------------------------
        else {
            return res.send('Your Email not true, you please check your email !!');

        }
    })
});

router.get('/', adminRestricted, (req, res) => {
    userModel.all()
        .then(rows => {
            res.render('vwAccount/index', {
                nguoidung: rows
            })
        })
        .catch(error => {
            res.render('error', { layout: false });
        });
})

router.get('/edit/:id', adminRestricted, (req, res, next) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.render('vwCategories/edit', { error: true });
        return;
    }

    userModel.single(id)
        .then(rows => {
            if (rows.length > 0) {
                var nguoidung = rows[0];
                res.render('vwAccount/edit', {
                    error: false,
                    nguoidung
                });
            } else {
                res.render('vwAccount/edit', {
                    error: true
                });
            }
        }).catch(next);
})

router.post('/update', adminRestricted, (req, res, next) => {
    userModel.updateUser(req.body).then(n => {
        res.redirect('/account');
    }).catch(next);

})

router.post('/delete', adminRestricted, (req, res, next) => {
    userModel.delete(+req.body.ID).then(n => {
        res.redirect('/account');
    }).catch(next);
})


module.exports = router;