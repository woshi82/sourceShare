var Index = require('../app/controllers/index'),
	Admin = require('../app/controllers/admin'),
	Manage = require('../app/controllers/manage'),
	Users = require('../app/controllers/users'),
	multer = require('multer');
var uploadMulter = multer({
	onFileUploadStart: function (file, req, res) {
		var id = req.session.user._id,
			pauseName = 'pause' + id;
			app.locals.pauseName = false;
	},
	onFileUploadData: function (file, data, req, res) {
		
		var id = req.session.user._id
			newName = 'percent' + id,
			pauseName = 'pause' + id;
			
	    if(app.locals.pauseName) {
	    	console.log('jieshujiehsu');
	    	delete app.locals.pauseName;
	    	return false;
	    }
	    else{
	    	// console.log('app.locals.uploadEnd11111:::' + app.locals.pauseName);
		  // console.log(data.length + ' of ' + file.fieldname + ' arrived');
		  app.locals.newName = file.size;
	    }
	}
});
var commonMulter = multer({});

module.exports = function(app){

	//app.use(Users.hasLogin);

	//首页
	app.get('/', Index.index);
	app.post('/getMore', Index.getMore)

	//admin
	app.get('/upload',Users.loginRequire, Admin.upload);
	app.post('/submit_item',commonMulter, Admin.submit_item);
	app.get('/finduser',Users.loginRequire, Manage.findUser);

	app.post('/admin/imgDelete', Admin.imgDelete);
	
	
	app.get('/admin/personal',Users.loginRequire, Admin.personal);
	app.post('/admin/globalUploader',Users.loginRequire, uploadMulter,Admin.globalUploader);
	app.post('/admin/uploaderProgress', Admin.uploaderProgress);
	app.post('/admin/removeUploader', Admin.removeUploader);
	app.post('/admin/createFolder', Admin.createFolder);
	app.post('/admin/reqItems', Admin.reqItems);

	app.get('/manage',Users.loginRequire, Admin.manage);

	//user
	app.get('/login', Users.login);
	app.post('/verify', Users.verify);
	app.get('/logout', Users.logout);
	//图片详细页
	app.get('/detail/:id', Index.detail);
	//用户详情页
	app.get('/space/:id', Users.loginRequire, Manage.userDetail);
	


}