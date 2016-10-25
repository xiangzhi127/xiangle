var Index=require('../app/controllers/index');
var Food=require('../app/controllers/food');
var User=require('../app/controllers/user');
var Comment=require('../app/controllers/comment');
var Category=require('../app/controllers/Category');
module.exports=function(app){

	//用户状态
	app.use(function(req,res,next){
		var _user=req.session.user;
		app.locals.user=_user;
		return next();
	});
	//首页
	app.get('/',Index.index);

	//Food
	app.get('/food/:id',Food.detail);
	app.get('/admin/food/new',User.loginRequired,User.adminRequired,Food.new);
	app.get('/admin/food/list',User.loginRequired,User.adminRequired,Food.list);
	app.post('/admin/food/save',User.loginRequired,User.adminRequired,Food.savePoster,Food.save);
	app.get('/admin/food/update/:id',User.loginRequired,User.adminRequired,Food.update);
	app.delete('/admin/food/list',User.loginRequired,User.adminRequired,Food.delete);

	//用户
	app.post('/user/signup',User.signup);
	app.post('/check',User.check);
	app.get('/yanzhengma',User.yzm);
	app.get('/user/checkCode',User.checkCode)
	app.post('/user/signin',User.signin);
	app.get('/logout',User.logout);
	app.get('/user/userlist',User.loginRequired,User.adminRequired,User.list);

	//评论
	app.post('/user/comment/save',User.loginRequired,Comment.save);

	
	//分类
	app.get('/admin/category/new',User.loginRequired,User.adminRequired,Category.new);
	app.post('/admin/category/save',User.loginRequired,User.adminRequired,Category.save);
	app.get('/admin/category/list',User.loginRequired,User.adminRequired,Category.list);

	//查询
	app.get('/results',Index.search);
}