var mongoose = require('mongoose'),
	sourceSchema = require('../schemas/source'),
	Source = mongoose.model('Source', sourceSchema);

module.exports = Source;