var Category=require('../models/category');

exports.new=function(req,res){
	res.render('category_admin',{
		title:'享乐 后台分类录入页',
		category:{}
	});
};

exports.save=function(req,res){
	var _category=req.body.category;
	var category=new Category(_category);
	category.save(function(err,category){
		if(err){
			console.log(err)
		}
		res.redirect('/admin/category/list')
	})
};

exports.list=function(req,res){

	Category.fetch(function(err,categories){
		if(err){
			console.log(err);
		}
		res.render('categorylist',{
			title:'享知 分类列表页',
			categories:categories
		});
	});
};


