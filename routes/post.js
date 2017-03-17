var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check').checkLogin;
var Post=require("../models/post");



router.get('/post', checkLogin,function (req, res) {
    res.render('post', {
        title: '文章发表',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});
router.post('/post', checkLogin,function (req, res) {
    //含有标签
    //var currentUser = req.session.user,
    //    post = new Post(currentUser.name, req.body.title, req.body.post);
    //含有标签
    var currentUser = req.session.user,
        tags = req.body.tag,
        post = new Post(currentUser.name, req.body.title, tags, req.body.post);
        post.save(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '发布成功!');
            res.redirect('/');//发表成功跳转到主页
        });
});

module.exports = router;
