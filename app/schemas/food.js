//模式编写
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;
var FoodSchema=new Schema({
	name:String,
	price:String,
	sat:String,
	poster:String,
	summary:String,
	pv:{
		type:Number,
		default:0
	},
	category:{
		type:ObjectId,
		ref:'Category'
	},
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
});
//每次在存储数据的时候，都会调用pre
FoodSchema.pre('save',function(next){
	//判断数据是否是新加的
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now();
	}else{
		this.meta.updateAt=Date.now();
	}
	next();
});
//静态方法，要在实例化后才会与数据库进行交互
FoodSchema.statics={
	//取出数据库里面的所有数据
	fetch:function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)//执行回调方法
	},
	//查询单条数据
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}
module.exports=FoodSchema;