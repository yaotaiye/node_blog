/*var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    Comment = require('../models/comment.js'),
    multer  = require('multer');*/
var express = require('express');
var router = express.Router();
var  Post = require('../models/post.js');

router.get("/",function (req,res,next) {

   /* res.render("index",{
     title:"首页",
     user: req.session.user,
     success: req.flash('success').toString(),
     error: req.flash('error').toString()
     });*/

    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = parseInt(req.query.p) || 1;
    //查询并返回第 page 页的 10 篇文章
    Post.getTen(null, page, function (err, posts, total) {
        if (err) {
            posts = [];
        }
        //bootcss carousel
        res.render('index', {
            title: '主页',
            posts: posts,
            page: page,
            isFirstPage: (page - 1) == 0,
            isLastPage: ((page - 1) * 5 + posts.length) == total,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

});

module.exports = router;