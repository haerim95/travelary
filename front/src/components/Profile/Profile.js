import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Media,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';

// core components
import Main from '../Category/Main.js';

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { getLoginMember } from '../../helpers/authUtils';
import { isProfileChanged } from '../../reducer/member';
import { memberLoginUpdate } from '../../reducer/member';

const Profile = () => {
  const [member, setMember] = useState({
    email: '',
    userPwd: '',
    userName: '',
    birthday: '',
    thought: '',
    profileImg: '',
    profileImgTitle: '',
  });
  const [pwdRepeat, setPwdRepeat] = useState('');

  // 로그인 한 멤버 메일주소 변수 저장
  const userEmail = getLoginMember().email;
  // history 참조 변수
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .post('http://localhost:3003/member/userProfile', { userEmail })
      .then((res) => {
        if (res.data.code === '200') {
          setMember(res.data.data);
        } else {
          alert('백엔드 새로고침 해주세요');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onMemberChange = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };
  // 비밀번호 재확인용 변수 업데이트
  const onPwdRepeatChange = (e) => {
    setPwdRepeat(e.target.value);
  };

  // 프로필이미지 업로드 버튼 이벤트 디스패치
  const imgUploadMouseEvent = () => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    document.querySelector('#imgUpload').dispatchEvent(event);
  };

  // 프로필 이미지 업로드
  const onImgUploadChange = (e) => {
    e.preventDefault();
    // 업로드 된 파일 객체 담아주기
    let file = e.target.files[0];

    // 용량 제한 걸어주기
    if (file.size > 1 * 1024 * 1024) {
      alert('Image size should be smaller than 1MByte.');
      // value 에 접근해서 비어있게 하는 초기화는 가능
      e.target.value = '';
      // 사진 비워주기
      onError();
      return;
    }

    // console.log('업로드 된 파일의 이름', file.name);
    // FileReader 인스턴스 생성
    let fileReader = new FileReader();

    // 이미지가 로드가 된 경우
    fileReader.onload = (e) => {
      const previewImage = document.getElementById('preview-image');
      // useState로 저장
      setMember({
        ...member,
        profileImg: e.target.result,
        profileImgTitle: file.name,
      });
      previewImage.src = e.target.result;
    };
    // reader가 이미지 읽도록 하기
    fileReader.readAsDataURL(e.target.files[0]);
  };

  const onSaveProfile = () => {
    //회원 정보 수정 버튼
    axios
      .post('http://localhost:3003/member/saveprofile', member)
      .then((res) => {
        if (res.data.code === '200') {
          dispatch(isProfileChanged(true));
          dispatch(memberLoginUpdate(member));
          alert('Profile has changed successfully!');
        }
      })
      .catch((err) => {
        alert(err);
      });
  };
  // 비밀번호 유효성 검사
  useEffect(() => {
    // 비밀번호 유효성 검사 - 8 ~ 15자 영문, 숫자 조합
    const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,15}$/;

    let pwdCheck = document.querySelector('.pwdCheck');
    let pwdRegExp = regExp.test(member.userPwd);
    let pwdCheckIcon = document.querySelector('.pwdCheckIcon');

    // 아직 아무것도 치지 않았을 때 공백
    if (member.userPwd === undefined || member.userPwd === '') {
      pwdCheck.innerText = '';
      pwdCheckIcon.classList.remove('text-success');
      return;
    }
    // 유효성 검사 통과 시 초록색으로 strong 뜨기
    if (pwdRegExp) {
      pwdCheck.classList.add('text-success');
      pwdCheck.classList.remove('text-muted');
      pwdCheck.innerText = 'strong';
    } else {
      // 통과 못했을 시 회색으로 week 뜨기
      pwdCheck.classList.add('text-muted');
      pwdCheck.classList.remove('text-success');
      pwdCheck.innerText = 'week';
    }

    // 비밀번호 재확인
    if (pwdRepeat === member.userPwd) {
      pwdCheckIcon.classList.add('text-success');
    } else {
      pwdCheckIcon.classList.remove('text-success');
    }
  }, [pwdRepeat, member.userPwd]);

  // 프로필 사진 없을 경우 디폴트 사진 불러오는 함수
  const onError = () => {
    setMember({
      ...member,
      profileImg: require('../../assets/img/theme/default-avatar.png').default,
    });
  };

  // 탈퇴하기
  const onDeleteAccount = () => {
    if (window.confirm('Are you sure to delete account?') === true) {
      axios
        .post('http://localhost:3003/member/delete', { userEmail })
        .then((res) => {
          if (res.data.code === '200') {
            alert('Account deleted successfully.');
            // 토큰 지우기
            window.localStorage.removeItem('jwtToken');
            window.localStorage.removeItem('loginMemberInfo');
            // 페이지 이동
            history.push('/auth/regist');
          } else {
            alert('sever error : Please try again. ');
          }
        })
        .catch((err) => {
          alert('error : Please try again.');
        });
    } else {
      return;
    }
  };

  return (
    <Main>
      <div className='header pb-8 pt-2 pt-md-7'>
        <Container fluid>
          <Row>
            <Col className='order-xl-1' xl='12'>
              <Card className='bg-secondary shadow'>
                <CardHeader className='bg-white border-0'>
                  <Row className='align-items-center'>
                    <Col xs='8'>
                      <h3 className='mb-0'>My account</h3>
                    </Col>
                    <Col className='text-right' xs='4'>
                      <Button
                        color='primary'
                        href='#pablo'
                        // onClick={(e) => e.preventDefault()}
                        onClick={onSaveProfile}
                      >
                        Save
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className='heading-small text-muted mb-4'>
                      User information
                    </h6>
                    <div className='pl-lg-4'>
                      <Row>
                        <Col lg='6'>
                          <FormGroup>
                            <label
                              className='form-control-label'
                              htmlFor='input-username'
                            >
                              Username
                            </label>
                            <Input
                              name='userName'
                              value={member.userName}
                              onChange={onMemberChange}
                              id='input-username'
                              className='form-control-alternative'
                              // defaultValue='lucky.jesse'
                              // placeholder='Username'
                              type='text'
                            />
                          </FormGroup>
                        </Col>
                        <Col lg='6'>
                          <FormGroup>
                            <label
                              className='form-control-label'
                              htmlFor='input-email'
                            >
                              Email address
                            </label>
                            <Input
                              // name='email'
                              value={member.email}
                              onChange={onMemberChange}
                              id='input-email'
                              className='form-control-alternative'
                              placeholder='jesse@example.com'
                              type='email'
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg='6'>
                          <FormGroup>
                            <label
                              className='form-control-label'
                              htmlFor='input-password'
                            >
                              Password
                            </label>
                            <Input
                              name='userPwd'
                              value={member.userPwd}
                              onChange={onMemberChange}
                              className='form-control-alternative'
                              id='input-password'
                              placeholder='Password'
                              type='password'
                            />
                            <div>
                              <small className='text-muted text-center'>
                                8 - 10 characters, must contain both letters and
                                numbers
                              </small>
                              <div className='text-muted font-italic'>
                                {/* 비밀번호 유효성 검사 */}
                                <small>
                                  password strength:
                                  {/* <span className='text-success font-weight-700'>strong</span> */}
                                  <span className='pwdCheck font-weight-700'></span>
                                </small>
                              </div>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col lg='6'>
                          {/* 비밀번호 재확인 */}
                          <FormGroup>
                            <label
                              className='form-control-label'
                              htmlFor='input-last-name'
                            >
                              Confirm Password
                            </label>
                            <InputGroup className='input-group-alternative'>
                              <Input
                                name='pwdRepeat'
                                onChange={onPwdRepeatChange}
                                value={pwdRepeat}
                                placeholder='Confirm Password'
                                type='password'
                                autoComplete='new-password'
                              />
                              <InputGroupAddon addonType='append'>
                                <InputGroupText>
                                  <i className='ni ni-check-bold pwdCheckIcon' />
                                </InputGroupText>
                              </InputGroupAddon>
                            </InputGroup>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg='6'>
                          <FormGroup>
                            <label
                              className='form-control-label'
                              htmlFor='input-birthday'
                            >
                              Birthday
                            </label>
                            <Input
                              name='birthday'
                              value={member.birthday}
                              onChange={onMemberChange}
                              id='input-birthday'
                              className='form-control-alternative'
                              defaultValue='Lucky'
                              placeholder='First name'
                              type='date'
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <hr className='my-4' />
                      {/* <br></br> */}
                      <Row>
                        <Col lg='6'>
                          <FormGroup>
                            <label
                              className='form-control-label'
                              htmlFor='input-profile-Image'
                            >
                              Profile Picture
                            </label>
                            <div>
                              <small className='text-muted'>
                                Click the picture to upload profile photo
                              </small>
                            </div>
                            <br></br>
                            {/* 프로필 사진 업로드 */}
                            <InputGroup className='input-group-alternative text-center'>
                              <InputGroupAddon addonType='prepend'>
                                <Button
                                  id='imgUploadBtn'
                                  className='text-muted'
                                  onClick={imgUploadMouseEvent}
                                >
                                  upload
                                </Button>
                              </InputGroupAddon>
                              <div
                                id='input-profile-Image'
                                className='text-center'
                                style={{
                                  lineHeight: '40px',
                                  paddingLeft: '10px',
                                }}
                              >
                                {member.profileImgTitle}
                              </div>
                            </InputGroup>
                            {/* 숨겨놓은 못생긴 인풋 박스 */}
                            <div style={{ display: 'none' }}>
                              <Input
                                name='imgUpload'
                                id='imgUpload'
                                onChange={onImgUploadChange}
                                type='file'
                                accept='image/*'
                              />
                            </div>
                          </FormGroup>
                        </Col>

                        <Col lg='6'>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              // alignItems: 'center',
                            }}
                          >
                            <label for='imgUpload'>
                              <Media className='align-items-center avatar-main-wrap'>
                                <div
                                  className='avatar-main avatar-sm rounded-circle'
                                  style={{
                                    width: '300px',
                                    height: '300px',
                                    justifyContent: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  <img
                                    id='preview-image'
                                    alt='...'
                                    src={
                                      member.profileImg == null ||
                                      member.profileImg === ''
                                        ? onError()
                                        : member.profileImg
                                    }
                                    style={{
                                      width: '300px',
                                      height: '300px',
                                    }}
                                  />
                                </div>
                              </Media>
                            </label>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <hr className='my-4' />

                    <h6 className='heading-small text-muted mb-4'>THOUGHT</h6>
                    <div className='pl-lg-4'>
                      <FormGroup>
                        {/* <label></label> */}
                        <Input
                          name='thought'
                          className='form-control-alternative'
                          value={member.thought}
                          onChange={onMemberChange}
                          placeholder='A few words about you ...'
                          rows='4'
                          defaultValue='만난 사람 모두에게서 무언가를 배울 수 있는 사람이 세상에서 제일 현명하다.'
                          type='textarea'
                        />
                      </FormGroup>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <br></br>
          <Card className='bg-secondary shadow'>
            <CardHeader className='bg-white border-0'>
              <Row>
                <Col xs='12'>
                  <h6 className='heading-small text-muted mb-4'>
                    Delete account
                  </h6>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Row>
                <Col xs='10'>
                  <small className='text-muted'>
                    Are you absolutely sure that you want to delete your
                    Travelary account? &nbsp;
                    <b>
                      Please note that there is no option to restore the account
                      or its data. &nbsp;
                    </b>
                    If you click the button, your account will be deleted.
                  </small>
                </Col>
                <Col xs='2'>
                  <button
                    onClick={onDeleteAccount}
                    type='button'
                    class='btn btn-secondary btn-sm text-muted'
                  >
                    Delete account
                  </button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
      </div>
    </Main>
  );
};

export default Profile;
