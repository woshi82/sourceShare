var mongoose = require("mongoose"),
    usersSchema = require('../schemas/users'),
	Users = mongoose.model('Users', usersSchema);

module.exports = Users;