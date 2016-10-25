var Food=require('../models/food');
var Comment=require('../models/comment');
var Category=require('../models/category');
var _=require('underscore');
var fs=require('fs');
var path=require('path');
exports.detail=function(req,res){
	var id=req.params.id;
	Food.update({_id: id}, {$inc: {pv: 1}}, function(err) {
	    if (err) {
	      console.log(err)
	    }
	 })
	Food.findById(id,function(err,food){
		Comment
			.find({food:id})
			.populate('from','name')
			.populate('reply.from reply.to','name')
			.exec(function(err,comments){
				console.log(comments);
				res.render('detail',{
					title:'享知 详情页',
					food:food,
					comments:comments
				});
			})
	})
	
};
exports.new=function(req,res){
	Category.find({}, function(err, categories) {
		res.render('admin',{
			title:'享知 后台录入页',
			categories:categories,
			food:{}
		});
	})

};
exports.save=function(req,res){
	var id=req.body.food._id;
	var foodObj=req.body.food;
	var _food;
	if(req.poster){
		foodObj.poster=req.poster;
	}
	if(id){
		Food.findById(id,function(err,food){
			if(err){
				console.log(err);
			}
			_food=_.extend(food,foodObj);
			_food.save(function(err,food){
				if(err){
					console.log(err);
				}
				res.redirect('/food/'+food._id);
			})
		})
	}else{
		_food=new Food(foodObj);
		var categoryId=foodObj.category;
		var categoryName=foodObj.categoryName;
		_food.save(function(err,food){
			if(err){
				console.log(err);
			}
			if(categoryId){
				Category.findById(categoryId,function(err,category){
					category.foods.push(food._id);
					category.save(function(err,category){
						res.redirect('/food/'+food._id);
					})
				})
			}else if(categoryName){
				var category = new Category({
		          name: categoryName,
		          foods: [food._id]
		        })

		        category.save(function(err, category) {
		          food.category = category._id
		          food.save(function(err, food) {
		            res.redirect('/food/'+food._id);
		          })
		        })
			}
		})
	}
};
exports.savePoster = function(req, res, next) {
	var posterData = req.files.uploadPoster;
	var filePath = posterData.path
	var originalFilename = posterData.originalFilename
	console.log(req.files);
	if (originalFilename) {
	    fs.readFile(filePath, function(err, data) {
		    var timestamp = Date.now()
		    var type = posterData.type.split('/')[1]
		    var poster = timestamp + '.' + type
		    var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)
	    fs.writeFile(newPath, data, function(err) {
	       	req.poster = poster
	        next()
	      })
	    })
	}
	else {
	    next()
	}
}
exports.list=function(req,res){
	Food.find({})
		.populate('Category','name')
		.exec(function(err,foods){
			if(err){
				console.log(err);
			}
			res.render('list',{
				title:' 列表页',
				foods:foods
			});
		})
};
exports.update=function(req,res){
	var id=req.params.id;
	if(id){
		Food.findById(id,function(err,food){
			Category.find({}, function(err, categories) {
	        res.render('admin', {
	          title: '享乐 后台更新页',
	          food: food,
	          categories: categories
	        })
	      })
		})
	}
};
exports.delete=function(req,res){
	var id=req.query.id;
	if(id){
		Food.remove({_id:id},function(err,food){
			if(err){
				console.log(err);
			}else{
				res.json({success:1});
			}
		})
	}
};