const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const config = require('./config/key');
const cookieParser = require('cookie-parser');
const { User } = require('./models/User');

//application/x_www_form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')

mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connect...'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.get('/api/hello', (req, res) => {
    res.send('안녕하세요 ~ ')
})

app.post('/register', (req, res) => {
    // 회원 가입할 때 필요한 정보들을 clinet로 부터 받아 DB에 입력
    // body 사용하려면 body-parser가 필요함
    const user = new User(req.body)
    user.save((err, userInfo) => {
        console.log(err);
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {
    // 요청된 이메일을 베이터베이스에서 있는지 확인
    User.findOne({ email: req.body.email }, function(err, user){
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호 확인
        user.comparePassword(req.body.password, function(err, isMatch) {
            if(!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다"});
        })

    // 비밀번호 검증이 되면 토큰 생성
        user.generateToken(function (err, user){
            if(err) return res.status(400).send(err);

            // 토큰 저장 (쿠키 또는 로컬스토리지에 저장 가능)
            res.cookie("x_auth", user.token)
            .status(200).json({ loginSuccess: true, userId: user._id})
        })
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
