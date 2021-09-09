import axios from 'axios';
import {
  all,
  fork,
  call,
  put,
  delay,
  takeLatest,
  throttle,
} from 'redux-saga/effects'; // saga 이펙트
import {
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_REQUEST,
  ADD_CATEGORY_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  REMOVE_CATEGORY_REQUEST,
  REMOVE_CATEGORY_SUCCESS,
  REMOVE_CATEGORY_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  LOAD_CATEGORY_REQUEST,
  LOAD_CATEGORY_SUCCESS,
  LOAD_CATEGORY_FAILURE,
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  LOAD_POST_FAILURE,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
  UPLOAD_POST_IMAGES_REQUEST,
  UPLOAD_POST_IMAGES_SUCCESS,
  UPLOAD_POST_IMAGES_FAILURE,
  UPLOAD_POST_IMAGES_QUILL_REQUEST,
  UPLOAD_POST_IMAGES_QUILL_SUCCESS,
  UPLOAD_POST_IMAGES_QUILL_FAILURE,
} from '../reducer/post';

// ! API 는 제네레이터 함수를 사용하지 않는다.
// Step 2. 데이터를 api 로 보내준다.
function categoryAPI(data) {
  // 실제 서버에 요청을 보냄
  return axios.post('/category', data);
}

// Step 1. action에서 데이터 보내서
function* addCategory(action) {
  try {
    const result = yield call(categoryAPI, action.data);
    yield put({
      type: ADD_CATEGORY_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_CATEGORY_SUCCESS,
      data: result.data.id,
    });
  } catch (err) {
    yield put({
      type: ADD_CATEGORY_FAILURE,
      data: err.response.data,
    });
  }
}

function loadCategoryAPI(lastId, memberId) {
  // 실제 서버에 요청을 보냄
  return axios.get(`/categories?lastId=${lastId || 0}&memberId=${memberId}`);
}

function* loadCategory(action) {
  try {
    const result = yield call(loadCategoryAPI, action.lastId, action.memberId);
    console.log('멤버 아이디는?', action.memberId);
    yield put({
      type: LOAD_CATEGORY_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error('로딩에러입니다: ', err);
    yield put({
      type: LOAD_CATEGORY_FAILURE,
      data: err.response.data,
    });
  }
}

function loadPostAPI(lastId, id) {
  // 실제 서버에 요청을 보냄
  return axios.get(`/categories/${id}/?lastId=${lastId || 0}`);
}

function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.lastId, action.id);
    console.log(
      '포스트 로딩 결과 데이ㅓㅌ ㅓ : -------------------------- ',
      result.data
    );
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log('포스트 로딩에러입니다: ', err);
    yield put({
      type: LOAD_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function addPostAPI(data, categoryId) {
  //category/1/post
  return axios.post(`/category/${categoryId}/post/add`, data);
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data, action.categoryId);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADD_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function uploadImagesAPI(data) {
  //category/1/post
  return axios.post('/category/images', data);
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      data: err.response.data,
    });
  }
}

function uploadPostImagesAPI(data) {
  //category/1/post
  return axios.post('/category/post/images', data);
}

function* uploadPostImages(action) {
  try {
    const result = yield call(uploadPostImagesAPI, action.data);
    yield put({
      type: UPLOAD_POST_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_POST_IMAGES_FAILURE,
      data: err.response.data,
    });
  }
}

// quill 이미지
function uploadPostQuillImagesAPI(data) {
  return axios.post('/category/post/img', data);
}

function* uploadPostQuillImages(action) {
  try {
    const result = yield call(uploadPostQuillImagesAPI, action.data);
    yield put({
      type: UPLOAD_POST_IMAGES_QUILL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_POST_IMAGES_QUILL_FAILURE,
      data: err.response.data,
    });
  }
}

function removeCategoryAPI(data) {
  return axios.delete(`/category/${data}`);
}

function* removeCategory(action) {
  const result = yield call(removeCategoryAPI, action.data);
  try {
    delay(1000);
    yield put({
      type: REMOVE_CATEGORY_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_CATEGORY_FAILURE,
      data: err.response.data,
    });
  }
}

function removePostAPI(data) {
  return axios.delete('/api/post', data);
}

function* removePost(action) {
  try {
    delay(1000);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_POST_FAILURE,
      data: err.response.data,
    });
  }
}

// 비동기 액션 생성 함수
function* watchAddCategory() {
  // take : ADD_CATEGORY_REQUEST (해당)액션이 실행되기 까지 기다리겠다.
  // take: 단, 한번밖에 받지 않는다. 한번 실행하면 이벤트 리스너가 사라져버린다. (게시글을 하나밖에 못씀)
  // ADD_CATEGORY_REQUEST 액션이 실행되면 addCategory 함수가 실행된다. (상단에 있음)
  // 그래서 무한하게 실행되도록 while(true)문을 감싸서 사용한다. 원래 자바스크립트에선 금지된...코드지만 (무한실행때문에)
  // 제네레이터 함수는 next() 로 다음 함수를 실행하기 때문에 써도 ok -> 하지만 직관적이지 않으니까
  // 비동기 방식으로 작동하는 takeEvery를 사용한다. (while문 대체)
  // 근데 takeEvery는 두번클릭,세번클릭하면 두번,세번이 전부 실행이 된다.
  // 그래서 takeLatest 를 사용한다. 여러번 요청을 보내도 앞에거 다 무시하고 마지막것만 실행된다. (어휴..) -> 근데 프론트에서만 그렇게 인식한다
  // 응답은 완료된것 하나 외에는 다 무시하지만, 요청은 무시되지 않는다는 소리 그래서 서버쪽에서 데이터 중복 검사를 따로 해주어야한다.
  yield takeLatest(ADD_CATEGORY_REQUEST, addCategory);
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchRemoveCategory() {
  yield takeLatest(REMOVE_CATEGORY_REQUEST, removeCategory);
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchLoadCategory() {
  yield throttle(3500, LOAD_CATEGORY_REQUEST, loadCategory);
}

function* watchLoadPost() {
  yield throttle(4000, LOAD_POST_REQUEST, loadPost);
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchUploadPostImages() {
  yield takeLatest(UPLOAD_POST_IMAGES_REQUEST, uploadPostImages);
}
function* watchUploadPostQuillImages() {
  yield takeLatest(UPLOAD_POST_IMAGES_QUILL_REQUEST, uploadPostQuillImages);
}

export default function* postSaga() {
  yield all([
    fork(watchLoadPost),
    fork(watchLoadCategory),
    fork(watchAddCategory),
    fork(watchAddPost),
    fork(watchRemoveCategory),
    fork(watchRemovePost),
    fork(watchUploadImages),
    fork(watchUploadPostImages),
    fork(watchUploadPostQuillImages),
  ]);
}
