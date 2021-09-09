import axios from 'axios';
import { all, fork } from 'redux-saga/effects'; // saga 이펙트

import postSaga from './post';

axios.defaults.baseURL = 'http://localhost:3003';

// generator 함수 사용 function*
export default function* rootSaga() {
  // all은 배열을 받고 배열 안에 있는 것들을 모두 동시에 실행시켜준다.
  // fork : 비동기 함수 호출, 호출이 끝나기 전에 바로 다음꺼 실행중
  // call : 동기 함수 호출, then 안에서 함수를 실행시킨다고 생각
  yield all([fork(postSaga)]);
}
