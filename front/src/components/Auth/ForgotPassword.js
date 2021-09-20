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
  Col,
} from 'reactstrap';

import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Auth from './Auth';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');

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
          history.push('/auth');
        } else {
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
                <big>Forgot Password ?</big>
              </div>
              <div className='btn-wrapper text-center'></div>
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
        </Col>
      </Auth>
    </>
  );
};

export default ForgotPassword;
