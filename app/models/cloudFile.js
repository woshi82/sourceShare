var mongoose = require('mongoose'),
	cloudFileSchema = require('../schemas/cloudFile'),
	CloudFile = mongoose.model('CloudFile', cloudFileSchema);

module.exports = CloudFile;