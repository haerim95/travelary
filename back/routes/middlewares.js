exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    // res.status(403).send('isLoggedIn : 로그인 필요');
    console.log('isLoggedIn : 로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent('isNotLoggedIn : 로그인 한 상태입니다.');
    res.redirect(`/?error=${message}`);
    console.log('isNotLoggedIn : 로그인 한 상태입니다.');
  }
};
