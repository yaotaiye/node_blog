/**
 * Created by wty on 2017/3/14.
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var app = express();

//缓存
app.use(session({
    secret: settings.cookieSecret,
    //key: settings.db,//cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    url: settings.url
}));
//设置模板
/*增加app.set('port', process.env.PORT || 3000);可以直接使用node app.js启动网页了，但是在webStorm中就会报错*///app.set('port', process.env.PORT || 3000);
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// flash 中间件，用来显示通知
app.use(flash());
// 添加模板必需的三个变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = "";
    res.locals.error = "";
    next();
});

//解析参数设置
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));


//indexRoute(app);

app.use("/", require('./routes/reg'));
app.use("/", require('./routes/login'));
app.use("/", require('./routes/logout'));
app.use("/",require('./routes/index'));
app.use("/",require('./routes/post'));
app.use("/",require('./routes/article'));

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
module.exports = app;