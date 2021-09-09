const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// const Member = require('../models/member');
// ORM 참조하기 - 혹시 모르니까 잠시 복붙해놓음
var db = require('../models/index');
var Member = db.Member;

// username, password로 태그 name을 하기 싫을때는
// new LocalStrategy 의 첫번재 인자로 바꿔줄 수 있다.
module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'userPwd',
      },
      async (email, password, done) => {
        try {
          const exUser = await Member.findOne({ where: { email } });
          console.log('로컬전략에서 조회한 회원 ', exUser);
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.userPwd);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            }
          } else {
            done(null, false, { message: '가입되지 않은 회원입니다.' });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
