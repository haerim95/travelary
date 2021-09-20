import Auth from './Auth';
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
} from 'reactstrap';
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Register = () => {
  const [member, setMember] = useState({
    userName: '',
    userPwd: '',
    email: '',
    birthday: '',
  });
  const [pwdRepeat, setPwdRepeat] = useState('');
  const [emailPass, setEmailPass] = useState(true);
  const [pwdPass, setPwdPass] = useState(true);

  const history = useHistory();
  const userNameRef = React.useRef(null);
  const userPwdRef = useRef(null);
  const emailRef = useRef(null);
  const birthdayRef = useRef(null);

  // 비밀번호 재확인용 변수 업데이트
  const onPwdRepeatChange = (e) => {
    setPwdRepeat(e.target.value);
  };

  const onMemberChange = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    userNameRef.current.focus();
  }, []);

  // 비밀번호 유효성 검사
  useEffect(() => {
    // 비밀번호 유효성 검사 - 8 ~ 15자 영문, 숫자 조합
    const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,15}$/;

    let pwdCheck = document.querySelector('.pwdCheck');
    let pwdRegExp = regExp.test(member.userPwd);
    let pwdCheckIcon = document.querySelector('.pwdCheckIcon');

    // 아직 아무것도 치지 않았을 때 공백
    if (member.userPwd == undefined || member.userPwd == '') {
      pwdCheck.innerText = '';
      pwdCheckIcon.classList.remove('text-success');
      return;
    }
    // 유효성 검사 통과 시 초록색으로 strong 뜨기
    if (pwdRegExp) {
      pwdCheck.classList.add('text-success');
      pwdCheck.classList.remove('text-muted');
      pwdCheck.innerText = 'strong';
      setPwdPass(false);
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

  // 이메일 유효성 검사
  const checkEmail = (e) => {
    // 인풋박스에 메일을 적고 마우스를 때는 순간 서버로 조회 요청하기
    var regExp =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    // 형식에 맞는 경우 true 리턴
    const checkEmail = document.querySelector('.checkEmail');
    const emailCheckIcon = document.querySelector('.emailCheckIcon');
    if (member.email !== '') {
      if (regExp.test(e.target.value)) {
        axios
          .post('http://localhost:3003/member/checkEmail', {
            email: member.email,
          })
          .then((res) => {
            if (res.data.code === '200') {
              // 사용 가능한 이메일일 경우
              checkEmail.classList.add('text-success');
              checkEmail.classList.remove('text-muted');
              checkEmail.innerText = 'Email address available';
              emailCheckIcon.classList.add('text-success');
              setEmailPass(false);
            } else {
              // 이미 사용 중인 이메일일 경우
              checkEmail.classList.add('text-muted');
              checkEmail.classList.remove('text-success');
              checkEmail.innerText = 'Email address already in use';
              emailCheckIcon.classList.remove('text-success');
            }
          })
          .catch(() => {});
      } else {
        checkEmail.classList.add('text-muted');
        checkEmail.classList.remove('text-success');
        checkEmail.innerText = 'Incorrect email format';
        emailCheckIcon.classList.remove('text-success');
      }
    } else {
      checkEmail.innerText = '';
      emailCheckIcon.classList.remove('text-success');
    }
  };

  // 유효성 검사
  const registerFormCheck = () => {
    // 빈 칸 작성시 알림창으로 알려주기
    if (!member.userName) {
      alert('Please fill out your name!');
      userNameRef.current.focus();
      return false;
    }
    if (!member.email) {
      alert('Please fill out email address');
      emailRef.current.focus();
      return false;
    }
    if (emailPass) {
      alert('Use another email');
      emailRef.current.focus();
      return false;
    }

    if (!member.userPwd) {
      alert('Please fill out your password!');
      userPwdRef.current.focus();
      return false;
    }
    if (pwdPass) {
      alert('Check password please.');
      return false;
    }

    if (!member.birthday) {
      alert('Please fill out your birthday!');
      return false;
    }

    return true;
  };

  // 회원 등록 버튼 실행 함수
  const onRegister = (e) => {
    e.preventDefault();

    if (registerFormCheck()) {
      axios
        .post('http://localhost:3003/member/register', member)
        .then((res) => {
          alert('Welcome to Travelary! Please Sign In.');
          history.push('/auth');
        })
        .catch(() => {});
    }
  };

  return (
    <>
      <Auth>
        <Col lg='6' md='8'>
          <Card className='bg-secondary shadow border-0'>
            <CardBody className='px-lg-5 py-lg-5'>
              <div className='text-center text-muted mb-4'>
                <big>Register</big>
              </div>
              <Form role='form' onSubmit={onRegister}>
                <FormGroup>
                  <InputGroup className='input-group-alternative mb-3'>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <i className='ni ni-hat-3' />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name='userName'
                      id='userName'
                      value={member.userName}
                      onChange={onMemberChange}
                      ref={userNameRef}
                      placeholder='Name'
                      type='text'
                      autocomplete='off'
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className='input-group-alternative mb-0'>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <i className='ni ni-email-83' />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name='email'
                      value={member.email}
                      onChange={onMemberChange}
                      onBlur={checkEmail}
                      ref={emailRef}
                      placeholder='Email'
                      type='email'
                      autoComplete='new-email'
                      autocomplete='off'
                    />
                    <InputGroupAddon addonType='append'>
                      <InputGroupText>
                        <i className='ni ni-check-bold emailCheckIcon' />
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {/*//! 이메일 중복 검사 */}
                  <small>
                    <span className='checkEmail font-italic'></span>
                  </small>
                </FormGroup>
                <FormGroup>
                  <InputGroup className='input-group-alternative'>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <i className='ni ni-lock-circle-open' />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name='userPwd'
                      value={member.userPwd}
                      onChange={onMemberChange}
                      ref={userPwdRef}
                      placeholder='Password'
                      type='password'
                      autoComplete='new-password'
                      autocomplete='off'
                    />
                  </InputGroup>
                  <small className='text-muted text-center'>
                    8 - 10 characters, must contain both letters and numbers
                  </small>
                  <div className='text-muted font-italic'>
                    {/* 비밀번호 유효성 검사 */}
                    <small>
                      password strength:
                      <span className='pwdCheck font-weight-700'></span>
                    </small>
                  </div>
                </FormGroup>
                {/* 비밀번호 재확인 */}
                <FormGroup>
                  <InputGroup className='input-group-alternative'>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <i className='ni ni-lock-circle-open' />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      onChange={onPwdRepeatChange}
                      value={pwdRepeat}
                      placeholder='Confirm Password'
                      type='password'
                      autoComplete='new-password'
                      autocomplete='off'
                    />
                    <InputGroupAddon addonType='append'>
                      <InputGroupText>
                        <i className='ni ni-check-bold pwdCheckIcon' />
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className='input-group-alternative'>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <i className='ni ni-calendar-grid-58' />
                      </InputGroupText>
                    </InputGroupAddon>
                    {/* date 타입 브라우저 지원 문제 예외처리하기 */}
                    <Input
                      name='birthday'
                      value={member.birthday}
                      onChange={onMemberChange}
                      ref={birthdayRef}
                      placeholder='Birthday'
                      type='date'
                      autoComplete='new-password'
                      autocomplete='off'
                    />
                  </InputGroup>
                </FormGroup>
                <div className='text-center'>
                  <Button
                    // onClick={onRegister}
                    className='mt-4'
                    color='primary'
                    type='submit'
                  >
                    Create account
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Auth>
    </>
  );
};

export default Register;
