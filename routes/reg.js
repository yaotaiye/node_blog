var express = require('express');
var router = express.Router();
var checkNotLogin = require('../middlewares/check').checkNotLogin;
var fs = require('fs');
var path = require('path');
var crypto = require('crypto'),
    User = require('../models/user.js');


router.get('/reg',checkNotLogin, function (req, res,next) {
    res.render('reg', {
        title: '用户注册',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});
router.post('/reg',checkNotLogin, function (req, res,next) {

    var name = req.body.name,
        password = req.body.password,
        repassword = req.body.repassword;

    // 校验参数
    try {
        if (!(name.length >= 1 && name.length <= 10)) {

            throw new Error('名字请限制在 1-10 个字符');
        }

       /* if (!req.files.avatar.name) {
            throw new Error('缺少头像');
        }*/
        if (password.length < 6) {
            throw new Error('密码至少 6 个字符');
        }
        if (password !== repassword) {
            throw new Error('两次输入密码不一致');
        }
    } catch (e) {
        // 注册失败，异步删除上传的头像
       // fs.unlink(req.files.avatar.path);
        req.flash('error', e.message);
        return res.redirect('/reg');
    }
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: name,
        password: password,
        email: req.body.email
    });
    //检查用户名是否已经存在
    User.get(newUser.name, function (err, user) {
        if (err) {
            console.log("reg"+err)
            req.flash('error', err);
            return res.redirect('/');
        }
        if (user) {
            req.flash('error', '用户已存在!');
            return res.redirect('/reg');//返回注册页
        }
        //如果不存在则新增用户
        newUser.save(function (err, user) {
            if (err) {
                console.log(err)
                req.flash('error', err);
                return res.redirect('/reg');//注册失败返回主册页
            }
            req.session.user = newUser;//用户信息存入 session
            req.flash('success', '注册成功!');
            setTimeout(function () {
                res.redirect('/');//注册成功后返回主页
            },2000)

        });
    });
});

module.exports = router;
