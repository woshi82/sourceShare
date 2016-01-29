var Source = require('../models/source'),
	CloudFile = require('../models/cloudFile')
	fs = require("fs"),
	multer = require('multer'),
	path = require('path');

//图片资源管理界面
exports.manage = function (req,res){
	var user = app.locals.user;
    Source.fetch({'uploader': user._id},function (err, source){
	  	if (err) {
	  	    console.log(err)
	  	}
  	    var lists = source;
	  	
	  	res.render('manage',{
	  	    lists: lists
	  	})
    })
}

//个人云盘
exports.personal = function (req,res){
	var user = req.session.user;
	// var	catalog = req.query.path || '/';
	// console.log(req.query.path);
	// CloudFile
	// 	.find({user:user, catalog: '/'})
	// 	.sort({'meta.updateAt':-1})
	// 	.exec(function(err, cloudFile){
	// 		if(err) console.log(err);
	// 		res.render('personal',{lists: cloudFile});
	// 	})
	res.render('personal');
}

//请求云盘目录
exports.reqItems = function (req,res){
	var catalog = req.body.catalog;
	var user = req.session.user;
	// var	catalog1 = req.query.path || '/';
	// console.log(req.query.path);
	CloudFile
		.find({user:user, catalog: catalog})
		.sort({'meta.updateAt':-1})
		.exec(function(err, cloudFile){
			if(err) console.log(err);

			var datas = JSON.parse(JSON.stringify(cloudFile));
			datas.forEach(function(data){
				data.meta.updateAt = app.locals.moment(data.meta.updateAt).format('YYYY-MM-DD HH:mm:ss');
			})
			res.send(datas);
		})     
}

//创建文件夹
exports.createFolder= function (req,res){
	var newFolder = req.body,
		user = req.session.user;
		
	var pareFolder = app.locals.folder+ '/' + user.username + '/source',
		catalog = newFolder.catalog,
		folderName = newFolder.folderName,
		folderpath = pareFolder + catalog + folderName;

	folderNoRepeat(folderpath);

	function folderNoRepeat(path){
		console.log('333:;' +path);
		if (fs.existsSync(path)) {
			var aName = path.split('/');
			folderName = aName[aName.length-1];		
			var newName = folderName.replace(/\((\d+)\)$/,function(p,n1){
				n1 = n1-0+1;
				return '(' + n1 + ')';
			})
			if(newName == folderName) newName = newName+'(1)';
			folderName = newName;
			folderpath = pareFolder + catalog+ folderName;			
			folderNoRepeat(folderpath);
		}	
	}	

	makeDir(folderpath, function(err){
		if(err){console.log(err);}
		var cloudFile = {
			user: user,
			name: folderName,
			size: '-',
			type: 0,
			catalog:catalog 
		};
		_cloudFile = new CloudFile(cloudFile);
		_cloudFile.save(function(err, cloudFile){
			if(err){ console.log(err);}
			var data = JSON.parse(JSON.stringify(cloudFile));
			data.meta.createAt = app.locals.moment(data.meta.createAt).format('YYYY-MM-DD HH:mm:ss');
			res.send(data)
		})
	}) 	    
}

//上传文件
exports.globalUploader = function(req, res){
	var file = req.files.globalUploader,
		catalog = req.body.catalog,
		user = req.session.user;
	//创建文件夹
	var sourceFolder = app.locals.folder+ '/' + user.username + '/source' + catalog;

	makeDir(sourceFolder)

	//读写文件
	readAndWrite(file, sourceFolder, handleCb);   
	//保存数据
	function handleCb(){
		var cloudFile = {
			user: user,
			name: file.name,
			size: checkSize(file.size),
			type: 10,
			catalog: catalog
		};
		if(file.extension == 'zip' || file.extension == 'rar'){
			cloudFile.type = 1;
		}
		else if(file.extension == 'png' || file.extension == 'jpg' || file.extension == 'gif'){
			cloudFile.type = 2;
		}
		else {
			cloudFile.type = 10;
		}
		
		_cloudFile = new CloudFile(cloudFile);
		_cloudFile.save(function(err, cloudFile){
			if(err) console.log(err);
			res.send(cloudFile)
		})
	}
	
 	
}

//删除文件
exports.removeUploader = function(req, res){
	var pauseName = 'pause' + req.session.user._id;
	app.locals.pauseName = true;
	console.log("app.locals.pauseName:::"+app.locals.pauseName);

}
//上传文件进度
exports.uploaderProgress = function(req, res){
	var fullSize = req.body.fullSize;
	var newName = 'percent' + req.session.user._id;
	if(!app.locals.newName) return;
	var sessPercent = app.locals.newName;
	var	percent = parseInt(  sessPercent / fullSize * 100 );
	// console.log(percent);
	if(percent >= 100){
		delete app.locals.newName;
	}
    res.send({"percent":percent});
    
}

//图片数据上传页面
exports.upload = function (req,res){
	console.log( app.locals.user ) 
	app.locals.user = req.session.user ;
	res.render('upload', {
		title: 'upload'
	});
}

//提交图片数据
exports.submit_item = function (req,res){   
	var item = req.body.source;
	var user = req.session.user;
	var id, picFolder;
	var sourceItem = new Source(item);

	sourceItem.save(function(err, item){
		if (err) console.log(err)
		// picFolder = makeUserDir(username).picDirPath;
		//创建图片资源父文件夹
		picFolder = app.locals.folder+ '/' + user.username + '/picture';
		makeDir(picFolder);
		id = item._id;
		more();
	})

	function more(){
		//创建图片资源下的文件夹
		var idDirPath = picFolder + '/'+ id;
		var previewImgDirPath = picFolder + '/'+ id +'/previewImg';
		var appendDirPath = picFolder + '/'+ id +'/appendix';
		if (!fs.existsSync(idDirPath)) {
			fs.mkdirSync(idDirPath);

			if(!fs.existsSync(previewImgDirPath)){
				fs.mkdirSync(previewImgDirPath);              
			}
			if(!fs.existsSync(appendDirPath)){
				fs.mkdirSync(appendDirPath); 
			}
		}
		//读写文件
		var imgFile = req.files.previewImg,
			appendixFile = req.files.appendix;	
		if(imgFile.length){
			for (var i = 0; i < imgFile.length; i++) {
				readAndWrite(imgFile[i], picFolder + '/'+ id + '/previewImg');
			};
		}
		else{
			readAndWrite(imgFile, picFolder + '/'+ id + '/previewImg');
		}
		
		readAndWrite(appendixFile, picFolder + '/'+ id + '/appendix');

		res.redirect('/');
	}
}
//删除图片数据
exports.imgDelete = function (req,res){
	var ID = req.body.ID,
		username = req.session.user.username;
    Source.remove({_id: ID},function (err, source){
	  	if (err) {
	  	    console.log(err)
	  	}
	  	//删除文件夹
	  	var idDirPath = app.locals.folder+ username +'/'+ ID ;
	  	var rmdirSync = (function(){
		    function iterator(url,dirs){
		        var stat = fs.statSync(url);//读取文件信息
		        if(stat.isDirectory()){
		            dirs.unshift(url);//收集目录
		            inner(url,dirs);
		        }else if(stat.isFile()){
		            fs.unlinkSync(url);//直接删除文件
		        }
		    }
		    function inner(path,dirs){
		        var arr = fs.readdirSync(path);
		        for(var i = 0, el ; el = arr[i++];){
		            iterator(path+"/"+el,dirs);
		        }
		    }
		    return function(dir,cb){
		        cb = cb ||function(){};
		        var dirs = [];
		 
		        try{
		            iterator(dir,dirs);
		            console.log(dirs);
		            for(var i = 0, el ; el = dirs[i++];){
		                fs.rmdirSync(el);//一次性删除所有收集到的目录
		            }
		            cb()
		        }catch(e){//如果文件或目录本来就不存在，fs.statSync会报错，不过我们还是当成没有异常发生
		            e.code ==="ENOENT" ? cb() : cb(e);
		        }
		    }
		})();
		rmdirSync(idDirPath, function(err) {
			if (err) console.log(err);
			else{res.send('删除成功');}
		});
		
  	   
    })
}
//转换文件大小
function checkSize(size){
	var sizeK = parseFloat(size/1024).toFixed(1);
	if(sizeK >= 1024){
		var sizeM = parseFloat(sizeK/1024)
		if(sizeM >= 1024){
			return (parseFloat(sizeM/1024).toFixed(1)) + 'G';
		}
		return (sizeM.toFixed(1)) + 'M';
	}
	else{
		return (sizeK) + 'kb';
	}
}

//创建文件夹
var makeDir = (function(){
	return(function(url,cb){
	cb = cb ||function(){};
	var pathtmp;

	url.split('/').forEach(function(dirname){
		// console.log("110022324"+dirname);
		if(pathtmp){
			pathtmp = path.join(pathtmp, dirname);
		}
		else{
			pathtmp = dirname;
		}
		if(!fs.existsSync(pathtmp)){
			fs.mkdirSync(pathtmp)
		}
	})
	cb();
	})
})()
//读写文件
function readAndWrite(file, folder, cb) {
	var tmp_path = file.path,
		target_path = folder +'/' + file.originalname;
	fileNoRepeat(target_path);
	function fileNoRepeat(target_path1){
		if (fs.existsSync(target_path1)) {
			console.log('exist');
			var aName = target_path1.split('/');
			//console.log(path.sep));
			var newName = aName[aName.length-1].replace(/\((\d+)\)\.\w+$/,function(p,n1){
				n1 = n1-0+1;
				return '(' + n1 + ').'+ file.extension;
			})	
			if(newName == aName[aName.length-1]) newName = newName.split('.'+file.extension)[0]+'(1).'+file.extension;
			target_path1 = folder +'/' + newName;
			file.name = newName;
			fileNoRepeat(target_path1);
		}
		else{
			target_path = target_path1;
			return;
		}	
	}
	var	readStream = fs.createReadStream(tmp_path),
		writeStream = fs.createWriteStream(target_path);
	readStream.pipe(writeStream);  //数据流导管
	readStream.on('end',function(){
		fs.unlink(tmp_path, function(err) {
			if (err) console.log(err);
			if(cb) cb();
		});
	});

}