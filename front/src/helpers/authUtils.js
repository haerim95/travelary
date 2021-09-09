//jwt 토큰 디코딩 팩키지 참조
import jwtDecode from 'jwt-decode';

//사용자 인증 토큰 조회하기 유틸함수
const getJWTToken = () => {
  const storageToken = window.localStorage.getItem('jwtToken');
  if (storageToken !== undefined) {
    return storageToken;
  } else {
    return '발급된 토큰이 없습니다.';
  }
};

//현재 사용자 로그인 여부 체크 함수
const isMemberLogined = (e) => {
  const storageToken = window.localStorage.getItem('jwtToken');

  console.log(
    `${e} 에서 호출한 로그인 상태체크 함수(return boolean)입니다. null 이면 로긴해서 토큰 받기 ==>`,
    storageToken
  );

  if (storageToken != null) {
    return true;
  } else {
    return false;
  }
};

//JWT 토큰 기반 로그인 사용자 정보 추출함수
const getLoginMember = () => {
  const storageToken = window.localStorage.getItem('jwtToken');

  if (storageToken == undefined) {
    return null;
  }
  //토큰에서 디코딩된 값을 추출한다.
  const decoded = jwtDecode(storageToken);
  const member = {
    memberId: decoded.memberId,
    email: decoded.email,
    userName: decoded.userName,
  };
  return member;
};

// const getLoginMemberInfo = () => {
//   const loginMemberInfo = window.localStorage.getItem('loginMemberInfo');

//   if (loginMemberInfo == undefined) {
//     return null;
//   }

//   return loginMemberInfo;
// };

export { getJWTToken, isMemberLogined, getLoginMember };
