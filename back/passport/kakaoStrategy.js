const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

// const Member = require('../models/member');
// ORM 참조하기 - 혹시 모르니까 잠시 복붙해놓음
var db = require('../models/index');
var Member = db.Member;

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        // 카카오에서 발급해주는 아이디  -> .env에 넣을거임.
        clientID: process.env.KAKAO_ID,
        // 카카오로부터 인증 결과를 받을 라우터 주소
        callbackURL: '/member/kakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);

        try {
          const exUser = await Member.findOne({
            where: { snsId: profile.id, provider: 'kakao' },
          });
          // 카카오를 통해 회원가입 했을 경우 전략 종료
          if (exUser) {
            done(null, exUser);
          } else {
            // 카카오를 통해 회원가입한 사용자가 없다면 회원가입 진행.
            // 인증 후 callbackURL으로 카카오에서 accessToken, refreshToken, profile을 보냄.
            const newUser = await Member.create({
              email: profile._json && profile._json.kakao_account.email,
              userPwd: profile.email,
              userName: profile.displayName,
              birthday: null,
              snsId: profile.id,
              provider: 'kakao',
            });
            done(null, newUser);
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};
