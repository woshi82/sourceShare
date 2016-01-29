var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId=Schema.ObjectId;

var usersSchema = new Schema({
	username: String, 
	password: String
});

usersSchema.statics = {
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


module.exports = usersSchema;