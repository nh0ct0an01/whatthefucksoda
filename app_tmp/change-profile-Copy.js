var mongoose=require('mongoose')
var bcrypt=require('bcrypt')
var body-parser=require('body-parser')
var express=require ('express')
var nodemon =require ('nodemon')
var express session=require('express session')
var connect-mongo=require('connect-mongo')
var UserSchema=new mongoose.Schema({

 oldpassword:
    {
        type:String, 
        required:true,
        
    }
 password: 
 {
    type: String,
    required: null,
  },
  passwordConf:
   {
    type: String,
    required: true,
  }
});
var user = mongoose.model('user',UserSchema)
module.exports=User;

if (req.body.oldpassword && req.body.password && req.body.passwordConf)
    {
        var userdata =
            {
                oldpassword:req.body.oldpassword,
                password:req.body.password,
                passwordConf:req.body.passwordConf,
            }
        //use schema.create to insert data into the db
  User.create(userData, function (err, user) {
    if (err) {
      return next(err)
    } else {
      return res.redirect('/profile');
    }
  });
//hashing a password before saving it to the database
UserSchema.pre('save',function(next) {
    var user=this;
    bcrypt.hash(user.password,10,function(err,hash)
    {
        if (err)
        {
            return next (err);
        }
        user.password=hash;
        next();
    })
});
//use sessions for tracking logins
app.use(session({
    secret:'',
    resave:true,
    saveUninitialized:false,
}));



    //authenticate input again database
    UserSchema.statics.authenticate=function (oldpassword,password,passwordConf,callback)
    {
        User.findOne({oldpassword:oldpassword})
        .exec(function(err,user)
        {
            if (err)
            {
                return callback (err)
            }
            else if (!user)
            {
                var err=new Error ('User not found ' );
                err.status=401;
                return callback(err);
            }
            bcrypt.compare(oldpassword,user.oldpassword,function(err,result)
            {
                if (result===true)
                {
                    return callback(null,user);
                }
                else 
                {
                    return callback();
                }
            })
        });
    }

    //GET5 /logout
    router.get('/logout',function(req,res,next)
    {
        if (req.session)
        {
            //delete session object 
            req.session.destroy(function(err)
            {
                if (err)
                {
                    return next (err);
                }
                else
                {
                    return res.redirect('/');
                }
            });
        }
    });
