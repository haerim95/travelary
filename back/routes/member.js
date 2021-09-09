var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { isNotLoggedIn } = require('./middlewares');

//ORM 참조하기
var db = require('../models/index');
var Member = db.Member;

//! 로그인
// localhost: 3003 / member / login;

router.post('/login', async (req, res) => {
  const email = req.body.email;
  const userPwd = req.body.userPwd;

  //동일 이메일주소 사용자 조회
  const loginUser = await Member.findOne({ where: { email: email } });

  console.log(loginUser);
  if (loginUser) {
    //일치하는 사용자 있을 경우 : 전달 받은 사용자 암호와 DB에 저장된 암호가 같은지 비교
    const result = await bcrypt.compare(userPwd, loginUser.userPwd);
    if (result) {
      // 암호가 일치 하는 경우

      //JWT 토큰에 담을 JSON 데이터
      var memberData = {
        memberId: loginUser.id,
        email: loginUser.email,
        userName: loginUser.userName,
      };

      //jwt.sign('JSON데이터',토큰인증키,{옵션(유효기간,발급자)})
      const token = jwt.sign(memberData, process.env.JWT_SECRET, {
        expiresIn: '24h', // 60m,10s,24h 60분,10초,24시간
        issuer: 'travelary',
      });

      return res.json({
        code: '200',
        data: { token: token, member: loginUser },
        msg: 'Ok',
      });
    } else {
      // 일치하는 사용자는 있으나 비밀번호가 틀렸을 때
      return res.json({
        code: '400',
        data: {},
        msg: 'Wrong password. Please try again',
      });
    }
  } else {
    // 사용자와 일치하는 정보가 없을 때
    return res.json({
      code: '400',
      data: {},
      msg: 'Email address does not exists.',
    });
  }
});

/*
//! 로컬 로그인
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      // 첫번째 매개변수가 있는 경우 : 실패
      console.error(authError);
      // return next(authError);
      return res.json({
        code: '400',
        data: {},
        msg: 'Wrong password. Please try again',
      });
    }
    if (!user) {
      // 두번째 매개변수가 없는 경우 : 실패
      console.error(`user 없음? local login error : ${info.message}`);
      // return res.redirect(`/?loginError=${info.message}`);
      return res.json({
        code: '400',
        data: {},
        msg: 'Email address does not exists.',
      });
    }
    // 두번째 매개변수가 있는 경우 : 성공 -> req.login 메서드 호출
    // Passport는 req객체에 login과 logout메서드를 추가한다.
    // req.login은 passport.serializeuser를 호출한다.
    // req.login에 제공하는 user 객체가 serializeUser로 넘어가게 된다.
    return req.logIn(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      // 로긴에러 없이 로긴에 성공한 경우
      //JWT 토큰에 담을 JSON 데이터
      // console.log('받아온 로긴 데이터 ', user);
      var memberData = {
        memberId: user.id,
        email: user.email,
        userName: user.userName,
      };
      //jwt.sign('JSON데이터',토큰인증키,{옵션(유효기간,발급자)})
      const token = jwt.sign(memberData, process.env.JWT_SECRET, {
        expiresIn: '24h', // 60m,10s,24h 60분,10초,24시간
        issuer: 'travelary',
      });

      return res.json({
        code: '200',
        data: { token: token, member: memberData },
        msg: 'Ok',
      });
    });
  })(req, res, next);
});
*/

//! 회원가입
//localhost:3003/member/register
router.post('/register', async (req, res, next) => {
  const hashPwd = await bcrypt.hash(req.body.userPwd, 12);

  var member = {
    email: req.body.email,
    userPwd: hashPwd,
    userName: req.body.userName,
    birthday: req.body.birthday,
    // lastIp: req.ip,
  };

  const memberRegisterResult = Member.create(member);

  return res.json({
    code: '200',
    data: memberRegisterResult,
    msg: 'Ok',
  });
});

//! 메일 중복 검사
//localhost:3003/member/checkEmail
router.post('/checkEmail', async (req, res) => {
  const email = req.body.email;

  const checkEmailResult = await Member.findOne({ where: { email: email } });
  if (checkEmailResult == null) {
    return res.json({
      code: '200',
      data: [],
      msg: 'Valid email address',
    });
  } else {
    return res.json({
      code: '400',
      data: [],
      msg: 'Email address already in use',
    });
  }
});

//! 비밀번호 초기화 이메일 요쳥
//localhost:3003/member/forgotpassword
router.post('/forgotpassword', async (req, res) => {
  const userEmail = req.body.email;
  const checkEmailResult = await Member.findOne({
    where: { email: userEmail },
  });
  if (checkEmailResult == null) {
    // 일치하는 메일 주소가 없을 경우
    return res.json({
      code: '400',
      data: [],
      msg: 'No matching mail address found',
    });
  } else {
    // 일치하는 메일 주소가 있을 경우

    // 랜덤 비밀번호 생성하고 비밀번호 업데이트 - uuid 라이브러리 이용
    const tempPwd = uuidv4();
    const hashPwd = await bcrypt.hash(tempPwd, 12);
    const pwdChangeResult = await Member.update(
      { userPwd: hashPwd },
      { where: { email: userEmail } }
    );

    // 등록된 메일 주소로 비밀번호 전송하기 - nodemailer 라이브러리 이용
    let transporter = nodemailer.createTransport({
      service: 'gmail', //사용하고자 하는 서비스
      prot: 587,
      host: 'smtp.gmlail.com',
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });
    let message = await transporter.sendMail({
      from: 'Travelary@aaa.aaa', //? 보내는 주소 입력 -> 안됨?
      to: userEmail, // 위에서 선언해준 받는 사람 이메일
      subject: 'Here is your password reset', //메일 제목
      html: ` <div
                style="
                  border: 1px solid grey;
                  border-radius: 5px;
                  width: 600px;
                  height: 100px;
                "
              >
                <div style="padding: 10px">
                  Temporary passsword :
                  <h2>${tempPwd}</h2>
                </div>
              </div>`, // 내용
    });
    return res.json({
      code: '200',
      data: [],
      msg: 'Temporary password has been sent. Please check your email.',
    });
  }
});

//! 회원 프로필 조회
// localhost:3003/member/userProfile
router.post('/userProfile', async (req, res) => {
  const email = req.body.userEmail;

  try {
    const loginUser = await Member.findOne({
      attributes: [
        'email',
        'userName',
        'birthday',
        'thought',
        'profileImg',
        'profileImgTitle',
      ],
      where: { email: email },
    });
    return res.json({ code: '200', data: loginUser, msg: '사용자 정보 조회' });
  } catch (err) {
    return res.json({
      code: '500',
      data: {},
      msg: '회원 프로필 조회 사용자 정보 조회 에러 발생',
    });
  }
});

//! 회원 정보 수정
// localhost:3003/member/saveprofile
router.post('/saveprofile', async (req, res) => {
  const member = req.body;
  if (req.body.userPwd != null) {
    const hashPwd = await bcrypt.hash(req.body.userPwd, 12);

    const updated = await Member.update(
      {
        userPwd: hashPwd,
        userName: req.body.userName,
        birthday: req.body.birthday,
        thought: req.body.thought,
        profileImg: req.body.profileImg,
        profileImgTitle: req.body.profileImgTitle,
      },
      { where: { email: req.body.email } }
    );

    return res.json({
      code: '200',
      data: { updated },
      msg: 'Ok',
    });
  } else {
    const updated = await Member.update(
      {
        userName: req.body.userName,
        birthday: req.body.birthday,
        thought: req.body.thought,
        profileImg: req.body.profileImg,
        profileImgTitle: req.body.profileImgTitle,
      },
      { where: { email: req.body.email } }
    );

    return res.json({
      code: '200',
      data: { updated },
      msg: 'Ok',
    });
  }
});

//! 회원 정보 삭제
// localhost:3003/member/delete
router.post('/delete', async (req, res) => {
  const email = req.body.userEmail;
  const deleteResult = await Member.destroy({
    where: { email: email },
  });
  if (deleteResult === 1) {
    return res.json({ code: '200', data: {}, msg: 'deleted successfully' });
  } else {
    return res.json({
      code: '500',
      data: {},
      msg: '탈퇴 처리 에러 발생',
    });
  }
});

//! 회원 로그아웃
// localhost:3003/member/logout
router.post('/logout', async (req, res) => {
  req.logout();
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.clearCookie('jwtToken');
    res.redirect('http://localhost:3000/auth/login');

    return res.json({ code: '200', data: {}, msg: 'logged out successfully' });
  });
});

//! kakao 로그인 라우터
router.get('/kakao', passport.authenticate('kakao'));
router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  (req, res) => {
    // res.redirect('/');
    console.log('~~~~~~~~~~~~~~~~~~', req.user.userName);
    var memberData = {
      email: req.user.email,
      userName: req.user.userName,
    };

    //jwt.sign('JSON데이터',토큰인증키,{옵션(유효기간,발급자)})
    const token = jwt.sign(memberData, process.env.JWT_SECRET, {
      expiresIn: '24h', // 60m,10s,24h 60분,10초,24시간
      issuer: 'travelary',
    });
    res.cookie('jwtToken', token);
    res.redirect('http://localhost:3000/auth/login');
    // return res.json(res);
  }
);

module.exports = router;
