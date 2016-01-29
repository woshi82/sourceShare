var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var cloudFileSchema = new Schema({
	user: {type: ObjectId, ref: 'Users'},
	name: String,
	size: String,
	type: Number, // 0 文件夹  1 zip/rar  2 png/jpg/gif ……  10 其他
	catalog: String,
    meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}  
})

cloudFileSchema.pre('save', function(next){
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else {
		this.meta.updateAt = Date.now();
	}
	next();

})

cloudFileSchema.statics = {
	fetch: function (cb) {
		return this
			.find({})
			.sort({'meta.updateAt':-1})
			.exec(cb)
	},
	findById: function (id, cb){
		return this
		    .findOne({_id: id})
		    .exec(cb)
	}
}

module.exports = cloudFileSchema;