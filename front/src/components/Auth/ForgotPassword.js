/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

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
// import { useDispatch } from 'react-redux';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  // 전역데이터 제어용 디스패치 상수 생성
  // const globalDispatch = useDispatch();

  const history = useHistory();

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onForgetPassword = () => {
    if (email === '') {
      alert('Please fill out your name!');
    }
    console.log('email', email);
    axios
      .post('http://localhost:3003/member/forgotpassword', { email: email })
      .then((res) => {
        console.log('데이터 처리결과:', res.data);
        if (res.data.code === '200') {
          alert(res.data.msg);
          history.push('/auth/login');
        } else {
          alert(res.data.msg);
        }
        // alert('Welcome to Travelary! Please Sign In.');
        // history.push('/auth/login');
      })
      .catch(() => {});
  };
  return (
    <>
      <Col lg='5' md='7'>
        <Card className='bg-secondary shadow border-0'>
          <CardHeader className='bg-transparent pb-2'>
            <div className='text-muted text-center mt-2 mb-3'>
              <big>Forgot Password ?</big>
            </div>
            <div className='btn-wrapper text-center'>
              {/* <small>
                <span className='text-muted font-italic'>
                  Enter the email address associated with your account and we'll
                  send you a temporary password
                </span>
              </small> */}
              {/* <Button
                className='btn-neutral btn-icon'
                color='default'
                href='#pablo'
                onClick={(e) => e.preventDefault()}
              >
                <span className='btn-inner--icon'>
                  <img
                    alt='...'
                    src={
                      require('../../assets/img/icons/common/github.svg')
                        .default
                    }
                  />
                </span>
                <span className='btn-inner--text'>Github</span>
              </Button>
              <Button
                className='btn-neutral btn-icon'
                color='default'
                href='#pablo'
                onClick={(e) => e.preventDefault()}
              >
                <span className='btn-inner--icon'>
                  <img
                    alt='...'
                    src={
                      require('../../assets/img/icons/common/google.svg')
                        .default
                    }
                  />
                </span>
                <span className='btn-inner--text'>Google</span>
              </Button> */}
            </div>
          </CardHeader>
          <CardBody className='px-lg-5 py-lg-5'>
            <div className='text-center text-muted mb-5'>
              <small>
                Enter the email address associated with your account and we'll
                send you a temporary password
              </small>
            </div>
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
                    value={email}
                    onChange={onEmailChange}
                    placeholder='Email'
                    type='email'
                    autoComplete='new-email'
                  />
                </InputGroup>
              </FormGroup>
              {/* <FormGroup>
                <InputGroup className='input-group-alternative'>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='ni ni-lock-circle-open' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name='userPwd'
                    // value={setLogin.userPwd}
                    // onChange={onLoginChange}
                    placeholder='Password'
                    type='password'
                    autoComplete='new-password'
                  />
                </InputGroup>
              </FormGroup> */}
              {/* <div className='custom-control custom-control-alternative custom-checkbox'>
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
              </div> */}
              <div className='text-center'>
                <Button
                  onClick={onForgetPassword}
                  className='my-4'
                  color='primary'
                  type='button'
                  // onClick={onLogin}s
                >
                  Continue
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        {/* <Row className='mt-3'>
          <Col xs='6'>
            <a
              className='text-muted'
              href='#pablo'
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className='text-right' xs='6'>
            <a
              className='text-muted'
              href='#pablo'
              onClick={(e) => e.preventDefault()}
            >
              <Link to='/auth/register'>
                <small>Create new account</small>
              </Link>
            </a>
          </Col>
        </Row> */}
      </Col>
    </>
  );
};

export default ForgotPassword;
