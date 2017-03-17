/**
 * Created by wty on 2017/3/16.
 */
var express = require('express');
var router = express.Router();
var Post=require("../models/post");

router.get('/:name/:day/:title', function (req, res) {
    Post.getOne(req.params.name, req.params.day, req.params.title, function (err, post) {
        console.log(req.params.title)
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        res.render('article', {
            title: req.params.title,
            post: post,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
});
module.exports = router;

