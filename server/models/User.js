    const mongoose = require('mongoose')
    const bcrypt=require('bcrypt')
    const saltRounds=10
    const jwt = require('jsonwebtoken')

    const userSchema = mongoose.Schema({
        name: {
            type: String,
            maxlengh: 50
        },
        email: {
            type: String,
            trim: true,
            unique: 1
        },
        password: {
            type: String,
            maxlengh:50
        },
        role: {
            type: Number,
            default:0
        },
        image: String,
        token: {
            type:String
        },
        tokenExp: {
            type:Number
        }
    })

    //user모델에 정보를 저장하기 전에 할 내용을 지정
    userSchema.pre('save',function(next){
        var user=this
    if(user.isModified('password')){//비밀번호가 수정될 때만 암호화
        //비밀번호를 암호화
        bcrypt.genSalt(saltRounds, function (err,salt){
        if(err)return next(err) 
        bcrypt.hash(user.password,salt,function(err,hash){
            if(err)return next(err)
            user.password=hash
            next()
            })
            })
        }else{//다른 것을 수정할 때 암호화 없이 바로 next로 넘어감
            next()
        }

    })

    userSchema.methods.comparePassword=function(plainPassword,cb){
        //plainPassword 1234567 암호화된 비밀번호 $2b$10$JWGJNjfNsTgNGyWzGSTTDOllcM5tXdXTEokenzXIRS3WUYlGwlCaW
        bcrypt.compare(plainPassword,this.password,function(err,isMatch){
            if(err) return cb(err)
            cb(null,isMatch)
        })
    }

    userSchema.methods.generateToken=function(cb){
        
        var user=this
        
        //jsonwebtoken을 이용해서 토큰 생성
        var token = jwt.sign(user._id.toHexString(), 'secretToken')

        user.token=token
        user.save(function(err,user){
            if(err) return cb(err)
            cb(null,user)
        })
    }

    userSchema.statics.findByToken =function(token,cb){
        var user=this

        
        //토큰을 decode
        jwt.verify(token,'secretToken',function(err,decoded){
            //유저 아이디를 이용해서 유저를 찾은 다음에 클라이언트에서 가져온 토큰과
            //DB에 저장된 토큰이 일치하는지 확인
            user.findOne({"_id":decoded,"token":token},function(err,user){
                if(err) return cb(err)
                cb(null,user)
            })
        } )
    }

    const User = mongoose.model('User',userSchema)//모델의 이름과 스키마
    module.exports={User}//export

