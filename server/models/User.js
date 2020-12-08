const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const saltRounds = 10 // 암호화 자릿수
const jwt = require('jsonwebtoken');

const userSchma = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        maxlength: 50,
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    }
})

userSchma.pre('save', function(next){
    let user = this;
    if (user.isModified('password')) {
        //비밀번호 암호화
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) return next(err);
            // Store hash in your password DB.
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})

userSchma.methods.comparePassword = function(plainPassword, callBack){
    // 암호화된 암호끼리 비교
    bcrypt.compare(plainPassword, this.password, function(err, isMatch)
    {
        if(err) return callBack(err);
        callBack(null, isMatch);
    })
}

userSchma.methods.generateToken = function(callBack){
    let user = this;
    console.log(`test1 : ${user._id}`);
    console.log(`test2 : ${user._id.toHexString()}`);
    // Json Web Token을 활용하여 토큰 생성
    user.token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.save(function(err, user){
        if(err) return callBack(err);
        callBack(null, user);
    })
}


const User = mongoose.model('User', userSchma)

module.exports = { User }