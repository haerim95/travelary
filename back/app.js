var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multer = require('multer');
//cors 노드 팩키지를 참조한다.
const cors = require('cors');

// Passport 모듈 참조
const passport = require('passport');

// .env 설정기능 참조 적용
require('dotenv').config();
// MVC(Model영역 모듈 참조) 시퀄라이즈 ORM 객체 참조하기
var sequelize = require('./models/index.js').sequelize;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//passport config 참조
const passportConfig = require('./passport');

//사용자 정보 관리 라우팅 파일 참조
var memberRouter = require('./routes/member');

const postRouter = require('./routes/post');
const categoryRouter = require('./routes/category');
const categoriesRouter = require('./routes/categories');
// const postsRouter = require('./routes/posts');
// const postCategory = require('./models/postCategory.js');

var app = express();
//노드 어플리케이션에 cors기능 적용 - 모든 리소스 접근 CORS 허용하기
// app.use(
//   cors({
//     origin: '*',
//     credentials: true,
//   })
// );
// origin 에 * 넣으니까 에러 cors 에러 발생
// origin: true는 프론트 도메인 주소가 자동으로 Access-Control-Allow-Origin에 들어간다.
app.use(cors({ origin: true, credentials: true }));
// app.use(cors());

app.use('/', express.static(path.join(__dirname, 'public/upload')));
// app.use(express.urlencoded({ extended: false }));
// 시퀄라이즈 ORM객체를 이용해 지정한 MySQL 연결 동기화하기
sequelize.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

// passport 설정
passportConfig();

// express 서버 용량 제한 늘리기
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

// req객체에 passport설정 심기
app.use(passport.initialize());
// req.session 객체에 passport정보 저장하기
// 패스포트가 성공/미성공 여부 정보를 이곳에 제공
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// member 라우터 파일 기본 URL주소 정의
app.use('/member', memberRouter);

// post 라우터 불러오기
// app.use('/post', postRouter);
app.use('/category', categoryRouter); // 카테고리 단일
app.use('/categories', categoriesRouter); // 카테고리 리스트 (복수)
// app.use(`/category/${postCategory.id}/post`, postsRouter); // 포스트 리스트

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
