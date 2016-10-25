var User=require('../models/user');
var captchapng = require('captchapng');
exports.signup=function(req,res){
	var _user=req.body;
	console.log(_user)
	User.find({name:_user.name},function(err,user){
		if(err){
			console.log(err);
		}
		res.json({success:1});
		var user=new User(_user);
		user.save(function(err,user){
			if(err){
				console.log(err);
			}
			// res.redirect('/user/userlist');
		})
		res.session.user=user;
	})
};
exports.check=function(req,res){
	var _user=req.body.user;
	console.log(_user);
	User.findOne({name:_user},function(err,user){
		if(err){
			console.log(err);
		}
		if(user){
			console.log(user);
			// return res.redirect('/login.html')
			res.json({success:0});
		}else{
			res.json({success:1});
		}
	})
};
exports.logout=function(req,res){
	delete req.session.user;
	// delete app.locals.user;
	res.redirect('/');
}
exports.signin=function(req,res){
	var _user=req.body.user;
	var password=req.body.pwd;
	User.findOne({name:_user},function(err,user){
		if(err){
			console.log(err);

		}
		if(!user){
			res.json({success:0,msg:'用户名不存在'});
			return ;
			// return res.redirect('/register')
		}
		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err)
			}
			if(isMatch){
				req.session.user=user;
				res.json({success:1})
				// return res.redirect('/')
			}else{
				res.json({success:0,msg:'密码错误'})
				// return res.redirect('/login.html');
				console.log('密码错误');
			}
		});
	});
}

exports.list=function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err);
		}
		res.render('userlist',{
			title:'享知 用户列表页',
			users:users
		});
	});
}

exports.loginRequired=function(req,res,next){
	var user=req.session.user;
	if(!user){
		return res.redirect('/login.html');
	}
	next();
}

exports.adminRequired=function(req,res,next){
	var user=req.session.user;
	console.log('权限'+user.role)
	if(user.role <=10){
		return res.redirect('/login.html')
	}
	next();
}
exports.yzm=function(req,res,next){
    var code = '0123456789';
    var length = 4;
    var randomcode = '';
    for (var i = 0; i < length; i++) {
        randomcode += code[parseInt(Math.random() * 1000) % code.length];
    }
    // 保存到session
    // if (null == req.session[sessionConstant.login]) {
    //     req.session[sessionConstant.login] = {};
    // }
    // req.session[sessionConstant.login][sessionConstant.randomcode] = randomcode;
   	//输出图片
     var p = new captchapng(80,30,randomcode); // width,height,numeric captcha
    p.color(255, 255, 255, 0);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
    var img = p.getBase64();
    var imgbase64 = new Buffer(img,'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
}
exports.checkCode=function(req,res){
	var code=req.query.code;
	console.log(code)
}