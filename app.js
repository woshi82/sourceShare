var express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
    fs = require("fs"),
    path = require('path'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    mongoStore = require('connect-mongo')(session)
    app = express(),
    dataBaseUrl = 'mongodb://localhost/Source';

var port = process.env.PORT || 2000;


//配置session、cookie
app.use(cookieParser());

app.use(session({
  secret: 'hgits',
  store: new mongoStore({
    url: dataBaseUrl,
    collection: 'session',
     key:'express.sid'
  })
}))

//链接数据库
mongoose.connect(dataBaseUrl);

//设置模板路径及模板引擎
app.set('views', './app/views/page');
app.set('view engine', 'jade');


//转换输出对象
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })) ;

//设置静态资源路径
app.use(express.static(path.join(__dirname, 'public')))


// app.use(multer({
// }));

//设置 全局变量
app.locals.moment = require('moment');
app.locals.folder = './public/other';
// app.locals.disk = 'http:/10.173.232.34/images';
app.locals.disk = '/other';
// app.locals.folder = 'http:/10.173.232.236/images';
// app.locals.disk = 'E:\\document\\images';
require('./config/routes')(app);

app.listen(port, function(){
  console.log('deskManage Listening on port' + port);
})

















