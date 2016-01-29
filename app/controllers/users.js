var Users = require('../models/users');


exports.loginRequire = function (req,res, next){   
    var _user = req.session.user;
    if(_user){
        next();
    }
    else {
        res.redirect('/');
    }
}

exports.login = function (req,res){   
    res.render('login', { title: 'login' });
}

exports.logout = function (req,res){   
    delete req.session.user;
    delete app.locals.user;
    res.redirect('/');
}

exports.verify = function (req,res){ 
    var user = req.body;
    Users.findOne(user,function(err, user){
        if(err){
            console.log(err);
        }
        if(user){
            req.session.user = user;
            app.locals.user = user;
            res.json({success:1,message:"登录成功"});
            //res.redirect('/');
        }
        else{
            res.json({success:0,message:"您输入的密码或用户名不正确"});
        }
    });
    

}
