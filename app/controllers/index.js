var Source = require('../models/source'),
	fs = require("fs"),
    path = require('path'),
    multer = require('multer');


app.locals.firstMuch = 6;

exports.index = function (req,res){ 
    var firstPageMuch = app.locals.firstMuch; 
    app.locals.user = req.session.user;
    // Source.firstPage(firstPageMuch, function(err, source){
      Source
        .find({})
        .sort({'meta.updateAt':-1})
        .limit(firstPageMuch)
        .populate('uploader', 'username')
        .exec(function (err, sources){
            if (err) {
              console.log(err)
            }
            // console.log(sources[0].uploader.username);
            res.render('index',{
              lists: readImg(sources)
            })
        })
    // })
      
}

exports.getMore = function (req,res){   
    var iNowPage = parseInt( req.body.page );
    var onceMuch = 3; 

    Source
        // .paging(iNowPage,onceMuch)
        .find({})
        .sort({'meta.updateAt':-1})
        .skip(6+onceMuch*iNowPage)
        .limit(onceMuch)
        .populate('uploader', 'username')
        .exec(function (err, source){
            if (err) {
              console.log(err)
            }
            console.log(source.uploader);
            res.send({
              lists: readImg(source)
            })
        })
        
    // console.log(readImg(source)[0].previewImg);
    //console.log(readImg(source).length);

    
  
}

function readImg(source){
    var lists = JSON.parse( JSON.stringify(source) );        
    for (var i = 0; i < lists.length; i++) {   
        var id = lists[i]._id,
            addr =  '\\' + lists[i].uploader.username + '\\picture\\' + id +'\\previewImg';
        var folder_exists = fs.existsSync(app.locals.folder + addr);;
        // 读取文件夹里面的图片
        if(folder_exists == true) {
            var dirList = fs.readdirSync(app.locals.folder + addr);
            lists[i].previewImg = app.locals.disk + addr +'\\'+ dirList[0]; 
            // console.log(lists[i].previewImg);   
        }
    };
  return lists;
}




// app.get('/:filename', function (req, res) {

//     var targetDir = path.join(app.get('rootDir'), 'sourceImages');
//     var filePath = path.join(targetDir, req.params.filename);
//     fs.exists(filePath, function (exists) {
//             res.sendfile(exists ? filePath : path.join(targetDir, config.default));
//     });
// });

exports.detail = function (req,res){  
	var id = req.params.id,
      list;
   
  Source
    .findOne({_id: id})
    .populate('uploader', 'username')
    .exec(function(err, source){
      if(err) console.log(err);
      if(source){
        list = JSON.parse( JSON.stringify(source) );

        var addr_previewImg =  '\\' + list.uploader.username + '\\picture\\' + id +'\\previewImg',
            addr_appendix =  '\\' + list.uploader.username + '\\picture\\' + id +'\\appendix',
            ab_addr_previewImg = app.locals.folder + addr_previewImg,
            ab_addr_appendix  = app.locals.folder + addr_appendix ,
            re_addr_previewImg = app.locals.disk + addr_previewImg,
            re_addr_appendix  = app.locals.disk + addr_appendix;

            folder_exists_previewImg = fs.existsSync(ab_addr_previewImg),
            folder_exists_appendix = fs.existsSync(ab_addr_appendix);
        //读取文件夹里面的图片
        if(folder_exists_previewImg == true) {
            var dirList = fs.readdirSync(ab_addr_previewImg),
                aPreviewImg = [];
            dirList.forEach(function(fileName){
              aPreviewImg.push(re_addr_previewImg +'\\' + fileName);
              list.aPreviewImg = aPreviewImg;
            })    
        }else{
           list.aPreviewImg = '';   
        }

        if(folder_exists_appendix == true) {
            var dirListc = fs.readdirSync(ab_addr_appendix);
            list.appendix = re_addr_appendix  +'\\'+ dirListc[0];
                
        }else{
           list.appendix = '';   
        }
        res.render('detail',{
          title: '图片详细',
          list: list
        })

      }
      else{
        console.log('相应数据竟然丢失了');
      }

    })
	
}