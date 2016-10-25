var express=require('express');
var path=require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session')
var mongoStore=require('connect-mongo')(session);
var mongoose=require('mongoose');
var _=require('underscore');
var morgan = require('morgan');
var multipart = require('connect-multiparty');
var app=express();
var port=process.env.PORT||6500;
var dbUrl='mongodb://localhost/xiangle';
mongoose.connect('mongodb://localhost/xiangle');


app.locals.moment=require('moment');
app.use(multipart());
app.use(cookieParser())
app.use(session({
	secret:"xiangle",
	store:new mongoStore({
		url:dbUrl,
		collection:'sessions'
	}),
	resave: false,
	saveUninitialized: true
}));
//设置视图的根目录
app.set('views','./app/views/pages');

//设置默认的模板引擎
app.set('view engine','jade');
app.use(express.static(path.join(__dirname,'public')));
//

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//配置显示报错信息、格式化
if('development'===app.get('env')){
	app.set('showStackError',true);
	app.use(morgan(':method :url :status'));
	app.locals.pretty=true;
	mongoose.set('debug',true);
}
require('./config/routes')(app);
//监听端口
app.listen(port);

//后台打印成功建立服务信息
console.log('Server running at port:'+port);