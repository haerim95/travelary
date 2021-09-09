import { applyMiddleware, compose, createStore } from 'redux';
import { createWrapper } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

// reducer 불러와서
import reducer from '../reducer';
import rootSaga from '../sagas';

// 미들웨어 설정
const loggerMiddlewarereturn =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    // 삼단 고차 함수
    console.log(action);
    return next(action);
  };

const configureStore = () => {
  // 사가 미들웨어 사용
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware, loggerMiddlewarereturn];

  // 리덕스 개발 툴 설정
  const enhancer =
    process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(...middlewares)) // 배포용일때 (dev tool 연결함)
      : composeWithDevTools(applyMiddleware(...middlewares)); //  개발용 (dev tool 연결함)
  // 히스토리가 쌓이면 데이터가 쌓이는거이기 때문에 보안에 취약할 수 있다.

  // createStore로 store 생성
  const store = createStore(reducer, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

// 두번째 객체는 옵션 객체인데, 개발 모드일때 디버거 모드를 켜놓는다는 뜻이다.
const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === 'development',
});

export default wrapper;
