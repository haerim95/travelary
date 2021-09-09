const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
// const Member = require('../models/member');

//ORM 참조하기 - 혹시 모르니까 잠시 복붙해놓음
var db = require('../models/index');
var Member = db.Member;

module.exports = () => {
  // 로그인 성공시 실행, req.session에 어떤 데이터를 저장할지 결정하는 메소드
  // 매개변수 user를 받고 나서, done함수에 두번째 인수로 user.id(사용자 식별자)를 넘김.
  // user 가 어디서 오는지 나중에 설명
  // done의 첫번재 함수는 에러 발생시 사용, 두번째는 저장하고 싶은 데이터
  passport.serializeUser((user, done) => {
    done(null, user.email);
    console.log('serializeUser~~~', user);
    // 세션 안에 passport의 user 값으로 사용자의 식별값이 들어온다.
  });

  // 매 요청 시 실행
  // passport.session미들웨어가 이 메소드를 호출함
  // 위에서 done의 두번재 인수로 넣었던 데이터가 매개변수가 된다. 즉 사용자의 아이디(이메일)
  // 위에서 세션에 저장했던 아이디를 받아서 디비에서 사용자 정보를 조회한다.
  // 조회한 정보를 req.user에 저장하므로 앞으로 req.user를 통해 로그인한 사용자 정보 가져올수 있다.
  passport.deserializeUser((id, done) => {
    console.log('deserializeUser***********', id);

    Member.findOne({ where: { email: id } })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  // 로컬 로그인 전략 파일
  local();
  // 카카오 로그인 전략 파일
  kakao();
  // passport에서 로그인 시의 동작을 전략이라고 한다.
};
