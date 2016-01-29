var Source = require('../models/source'),
	Users = require('../models/users'),
      fs = require("fs"),
    multer = require('multer');

// exports.hasLogin = function (req,res, next){   
//     var _user = req.session.user;
//     if(_user){
//         next();
//     }
//     else {
//         redirect('/');
//     }
// }


exports.findUser = function (req,res){ 
  Users.find(function (err, users){
    if (err) {
      console.log(err)
    }
     
    res.render('findUser',{
      items: users
    })
  })
}

exports.userDetail= function (req,res){  
  var id = req.params.id,
      item;
   
  Users.findById(id,function(err, user){
    if(err) console.log(err);
    if(user){
     
      res.render('space',{
        title: '用户详情',
        item: user
      })

    }
    else{
      console.log('相应数据竟然丢失了');
    }

  })
  
}