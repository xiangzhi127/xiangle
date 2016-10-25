//首页控制器
var Food=require('../models/food');
var Category=require('../models/category');
exports.index=function(req,res){
	Category
		.find({})
		.populate({
			path:'foods',
			options:{limit:6}
		})
		.exec(function(err,categories){
		if(err){
			console.log(err);
		}
		res.render('index',{
			title:'享乐 首页',
			categories:categories
		});
	})	
};
exports.search = function(req, res) {
  var catId = req.query.cat
  console.log(catId)
  var q = req.query.q
  console.log(q)
  var page = parseInt(req.query.p, 10) || 0
  console.log(page)
  var count = 2
  var index = page * count

  if (catId) {
    Category
      .find({_id: catId})
      .populate({
        path: 'foods'
        // select: 'name poster'
      })
      .exec(function(err, categories) {
        if (err) {
          console.log(err)
        }
        var category = categories[0] || {}
        console.log(category)
        var foods = category.foods || []
        console.log(foods)
        var results = foods.slice(index, index + count)
        console.log(results);
        res.render('results', {
          title: '享乐 结果列表页面',
          keyword: category.name,
          currentPage: (page + 1),
          query: 'cat=' + catId,
          totalPage: Math.ceil(foods.length / count),
          foods: results
        })
      })
  }
  else {
    Food
      .find({name: new RegExp(q + '.*', 'i')})
      .exec(function(err, foods) {
        if (err) {
          console.log(err)
        }
         console.log(foods);
        var results = foods.slice(index, index + count)
        console.log(results);
        res.render('results', {
          title: '享乐 结果列表页面',
          keyword: q,
          currentPage: (page + 1),
          query: 'q=' + q,
          totalPage: Math.ceil(foods.length / count),
          foods: results
        })
      })
  }
}