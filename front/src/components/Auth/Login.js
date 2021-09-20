// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from 'reactstrap';

import React, { useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { memberLoginToken, memberLoginUpdate } from '../../reducer/member';
import Auth from './Auth';
import { isMemberLogined } from '../../helpers/authUtils';

const Login = () => {
  const [login, setLogin] = useState({
    email: '',
    userPwd: '',
  });

  const history = useHistory();
  // 전역데이터 제어용 디스패치 함수 생성
  const dispatch = useDispatch();

  // 로그인 여부 체크 - 로긴 했으면 메인 페이지로 이동시키기
  const isLogin = isMemberLogined('login.js');
  if (isLogin === true) {
    history.push('/');
  }

  const onLoginChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const onLogin = () => {
    // axios.defaults.withCredentials = true;
    axios
      .post('http://localhost:3003/member/login', login)
      .then((res) => {
        if (res.data.code === '200') {
          //토큰값을 웹브라우저 로컬스토리지에 보관하기 - 로그인 유지하기
          window.localStorage.setItem('jwtToken', res.data.data.token);
          window.localStorage.setItem(
            'loginMemberInfo',
            JSON.stringify(res.data.data.member)
          );

          //백엔드 API 호출시 발급된 JWT토큰을 Ajax 헤더에 x-access-token 영역에 기본 포함시키기
          axios.defaults.headers.common[
            'x-access-token'
          ] = `${res.data.data.token}`;
          alert(`WELCOME, ${res.data.data.member.userName}!`);
          history.push('/');

          //발급된 토큰값과 로그인한 유저 정보를 전역 데이터에 반영한다.
          dispatch(memberLoginToken(res.data.data.token));
          dispatch(memberLoginUpdate(res.data.data.member));
          dispatch(isLogin(true));
        } else {
          //서버측 에러 메시지 출력
          alert(res.data.msg);
        }
      })
      .catch(() => {});
  };

  return (
    <>
      <Auth>
        <Col lg='5' md='7'>
          <Card className='bg-secondary shadow border-0'>
            <CardHeader className='bg-transparent pb-2'>
              <div className='text-muted text-center mt-2 mb-3'>
                <big>Login</big>
              </div>
            </CardHeader>
            <CardBody className='px-lg-5 py-lg-5'>
              <Form role='form'>
                <FormGroup className='mb-3'>
                  <InputGroup className='input-group-alternative'>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>
                        <i className='ni ni-email-83' />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name='email'
                      value={setLogin.email}
                      onChange={onLoginChange}
                      placeholder='Email'
                      type='email'
                      autoComplete='new-email'
                      autocomplete='off'
                    />
                  </InputGroup>
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
                      value={setLogin.userPwd}
                      onChange={onLoginChange}
                      placeholder='Password'
                      type='password'
                      autoComplete='new-password'
                      autocomplete='off'
                    />
                  </InputGroup>
                </FormGroup>
                <div className='custom-control custom-control-alternative custom-checkbox'>
                  <input
                    className='custom-control-input'
                    id=' customCheckLogin'
                    type='checkbox'
                  />
                  <label
                    className='custom-control-label'
                    htmlFor='customCheckLogin'
                  >
                    <span className='text-muted'>Remember me</span>
                  </label>
                </div>
                <div className='text-center'>
                  <Button
                    className='my-4'
                    color='primary'
                    type='button'
                    onClick={onLogin}
                  >
                    Sign in
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className='mt-3'>
            <Col xs='6'>
              <Link to='/auth/forgot-password' className='text-muted'>
                <small>Forgot password?</small>
              </Link>
            </Col>
            <Col className='text-right' xs='6'>
              <Link to='/auth/register' className='text-muted'>
                <small>Create new account</small>
              </Link>
            </Col>
          </Row>
        </Col>
      </Auth>
    </>
  );
};

export default Login;
