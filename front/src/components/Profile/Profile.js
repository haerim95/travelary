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
  Container,
  Row,
  Col,
  Badge,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  UncontrolledTooltip,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';

// core components
import UserHeader from 'components/Headers/UserHeader.js';
import Header from 'components/Headers/Header';

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { isProfileChanged } from 'reducer/member';
import axios from 'axios';
import {
  getJWTToken,
  isMemberLogined,
  getLoginMember,
} from '../../helpers/authUtils';
import { memberLoginUpdate } from 'reducer/member';

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
          // setMember({
          //   userName: memberInfo.userName,
          //   userPwd: memberInfo.userPwd,
          //   email: memberInfo.email,
          //   birthday: memberInfo.birthday,
          // });
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
      // setPwdPass(false);
      // pwdPass.current = false;
      // alert(pwdPass.current.value);
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
    <>
      {/* <UserHeader /> */}
      {/* <div className='header pb-8 pt-5 pt-md-0'></div> */}
      {/* 상단 영역 사진 없애고 간격 좁혔음 */}
      <div className='header pb-7 pt-md-0'></div>

      {/* Page content */}
      {/* <Container className='mt--7' fluid> */}
      <Container className='mt-7' fluid>
        <Row>
          {/* 오른쪽 프로필 카드 없앰 */}
          {/* <Col className='order-xl-2 mb-5 mb-xl-0' xl='4'>
            <Card className='card-profile shadow'>
              <Row className='justify-content-center'>
                <Col className='order-lg-2' lg='3'>
                  <div className='card-profile-image'>
                    <a href='#pablo' onClick={(e) => e.preventDefault()}>
                      <img
                        alt='...'
                        className='rounded-circle'
                        src={
                          require('../../assets/img/theme/team-4-800x800.jpg')
                            .default
                        }
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className='text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4'>
                <div className='d-flex justify-content-between'>
                  <Button
                    className='mr-4'
                    color='info'
                    href='#pablo'
                    onClick={(e) => e.preventDefault()}
                    size='sm'
                  >
                    Connect
                  </Button>
                  <Button
                    className='float-right'
                    color='default'
                    href='#pablo'
                    onClick={(e) => e.preventDefault()}
                    size='sm'
                  >
                    Message
                  </Button>
                </div>
              </CardHeader>
              <CardBody className='pt-0 pt-md-4'>
                <Row>
                  <div className='col'>
                    <div className='card-profile-stats d-flex justify-content-center mt-md-5'>
                      <div>
                        <span className='heading'>22</span>
                        <span className='description'>Friends</span>
                      </div>
                      <div>
                        <span className='heading'>10</span>
                        <span className='description'>Photos</span>
                      </div>
                      <div>
                        <span className='heading'>89</span>
                        <span className='description'>Comments</span>
                      </div>
                    </div>
                  </div>
                </Row>
                <div className='text-center'>
                  <h3>
                    Jessica Jones
                    <span className='font-weight-light'>, 27</span>
                  </h3>
                  <div className='h5 font-weight-300'>
                    <i className='ni location_pin mr-2' />
                    Bucharest, Romania
                  </div>
                  <div className='h5 mt-4'>
                    <i className='ni business_briefcase-24 mr-2' />
                    Solution Manager - Creative Tim Officer
                  </div>
                  <div>
                    <i className='ni education_hat mr-2' />
                    University of Computer Science
                  </div>
                  <hr className='my-4' />
                  <p>
                    Ryan — the name taken by Melbourne-raised, Brooklyn-based
                    Nick Murphy — writes, performs and records all of his own
                    music.
                  </p>
                  <a href='#pablo' onClick={(e) => e.preventDefault()}>
                    Show more
                  </a>
                </div>
              </CardBody>
            </Card>
          </Col> */}
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

                  {/* Address */}
                  {/* <h6 className='heading-small text-muted mb-4'>
                    Contact information
                  </h6> */}
                  {/* <div className='pl-lg-4'> */}
                  {/* <Row>
                      <Col md='12'>
                        <FormGroup>
                          <label
                            className='form-control-label'
                            htmlFor='input-address'
                          >
                            Address
                          </label>
                          <Input
                            className='form-control-alternative'
                            defaultValue='Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09'
                            id='input-address'
                            placeholder='Home Address'
                            type='text'
                          />
                        </FormGroup>
                      </Col>
                    </Row> */}
                  {/* <Row>
                      <Col lg='4'>
                        <FormGroup>
                          <label
                            className='form-control-label'
                            htmlFor='input-city'
                          >
                            City
                          </label>
                          <Input
                            className='form-control-alternative'
                            defaultValue='New York'
                            id='input-city'
                            placeholder='City'
                            type='text'
                          />
                        </FormGroup>
                      </Col>
                      <Col lg='4'>
                        <FormGroup>
                          <label
                            className='form-control-label'
                            htmlFor='input-country'
                          >
                            Country
                          </label>
                          <Input
                            className='form-control-alternative'
                            defaultValue='United States'
                            id='input-country'
                            placeholder='Country'
                            type='text'
                          />
                        </FormGroup>
                      </Col>
                      <Col lg='4'>
                        <FormGroup>
                          <label
                            className='form-control-label'
                            htmlFor='input-country'
                          >
                            Postal code
                          </label>
                          <Input
                            className='form-control-alternative'
                            id='input-postal-code'
                            placeholder='Postal code'
                            type='number'
                          />
                        </FormGroup>
                      </Col>
                    </Row> */}
                  {/* </div> */}
                  {/* <hr className='my-4' /> */}
                  {/* Description */}
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
                  Are you absolutely sure that you want to delete your Travelary
                  account? &nbsp;
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

        {/* Table */}
        <Row style={{ display: 'none' }}>
          <div className='col'>
            <Card className='shadow'>
              <CardHeader className='border-0'>
                <h3 className='mb-0'>Card tables</h3>
              </CardHeader>
              <Table className='align-items-center table-flush' responsive>
                <thead className='thead-light'>
                  <tr>
                    <th scope='col'>Share Folder Name</th>
                    {/* <th scope='col'>Budget</th>
                    <th scope='col'>Status</th> */}
                    <th scope='col'>Members</th>
                    <th scope='col'>Status</th>
                    <th scope='col' />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope='row'>
                      <Media className='align-items-center'>
                        {/* <a
                          className='avatar rounded-circle mr-3'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={
                              require('../../assets/img/theme/bootstrap.jpg')
                                .default
                            }
                          />
                        </a> */}
                        <Media>
                          <span className='mb-0 text-sm'>
                            터키를 사랑하는 모임
                          </span>
                        </Media>
                      </Media>
                    </th>
                    {/* <td>$2,500 USD</td>
                    <td>
                      <Badge color='' className='badge-dot mr-4'>
                        <i className='bg-warning' />
                        pending
                      </Badge>
                    </td> */}
                    <td>
                      <div className='avatar-group'>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip742438047'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-1-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip742438047'
                        >
                          Ryan Tompson
                        </UncontrolledTooltip>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip941738690'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-2-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip941738690'
                        >
                          Romina Hadid
                        </UncontrolledTooltip>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip804044742'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-3-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip804044742'
                        >
                          Alexander Smith
                        </UncontrolledTooltip>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip996637554'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-4-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip996637554'
                        >
                          Jessica Doe
                        </UncontrolledTooltip>
                      </div>
                    </td>
                    <td>
                      <div className='d-flex align-items-center'>
                        <span className='mr-2'>accepted!</span>
                        {/* <div>
                          <Progress
                            max='100'
                            value='60'
                            barClassName='bg-danger'
                          />
                        </div> */}
                      </div>
                    </td>
                    <td className='text-right'>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          className='btn-icon-only text-light'
                          href='#pablo'
                          role='button'
                          size='sm'
                          color=''
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className='fas fa-ellipsis-v' />
                        </DropdownToggle>
                        <DropdownMenu className='dropdown-menu-arrow' right>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Another action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Something else here
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                  <tr>
                    <th scope='row'>
                      <Media className='align-items-center'>
                        {/* <a
                          className='avatar rounded-circle mr-3'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={
                              require('../../assets/img/theme/angular.jpg')
                                .default
                            }
                          />
                        </a> */}
                        <Media>
                          <span className='mb-0 text-sm'>
                            Angular Now UI Kit PRO
                          </span>
                        </Media>
                      </Media>
                    </th>
                    {/* <td>$1,800 USD</td>
                    <td>
                      <Badge color='' className='badge-dot'>
                        <i className='bg-success' />
                        completed
                      </Badge>
                    </td> */}
                    <td>
                      <div className='avatar-group'>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip746418347'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-1-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip746418347'
                        >
                          Ryan Tompson
                        </UncontrolledTooltip>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip102182364'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-2-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip102182364'
                        >
                          Romina Hadid
                        </UncontrolledTooltip>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip406489510'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-3-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip406489510'
                        >
                          Alexander Smith
                        </UncontrolledTooltip>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip476840018'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-4-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip476840018'
                        >
                          Jessica Doe
                        </UncontrolledTooltip>
                      </div>
                    </td>
                    <td>
                      <div className='d-flex align-items-center'>
                        <span className='mr-2'>I shared this share folder</span>
                        {/* <div>
                          <Progress
                            max='100'
                            value='100'
                            barClassName='bg-success'
                          />
                        </div> */}
                      </div>
                    </td>
                    <td className='text-right'>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          className='btn-icon-only text-light'
                          href='#pablo'
                          role='button'
                          size='sm'
                          color=''
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className='fas fa-ellipsis-v' />
                        </DropdownToggle>
                        <DropdownMenu className='dropdown-menu-arrow' right>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Another action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Something else here
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                  <tr>
                    <th scope='row'>
                      <Media className='align-items-center'>
                        {/* <a
                          className='avatar rounded-circle mr-3'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={
                              require('../../assets/img/theme/sketch.jpg')
                                .default
                            }
                          />
                        </a> */}
                        <Media>
                          <span className='mb-0 text-sm'>Black Dashboard</span>
                        </Media>
                      </Media>
                    </th>
                    {/* <td>$3,150 USD</td>
                    <td>
                      <Badge color='' className='badge-dot mr-4'>
                        <i className='bg-danger' />
                        delayed
                      </Badge>
                    </td> */}
                    <td>
                      <div className='avatar-group'>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip753056318'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-1-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip753056318'
                        >
                          Ryan Tompson
                        </UncontrolledTooltip>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip441753266'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-2-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip441753266'
                        >
                          Romina Hadid
                        </UncontrolledTooltip>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip188462246'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-3-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip188462246'
                        >
                          Alexander Smith
                        </UncontrolledTooltip>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip621168444'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-4-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip621168444'
                        >
                          Jessica Doe
                        </UncontrolledTooltip>
                      </div>
                    </td>
                    <td>
                      <div className='d-flex align-items-center'>
                        <span className='mr-2'>rejected</span>
                        {/* <div>
                          <Progress
                            max='100'
                            value='72'
                            barClassName='bg-danger'
                          />
                        </div> */}
                      </div>
                    </td>
                    <td className='text-right'>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          className='btn-icon-only text-light'
                          href='#pablo'
                          role='button'
                          size='sm'
                          color=''
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className='fas fa-ellipsis-v' />
                        </DropdownToggle>
                        <DropdownMenu className='dropdown-menu-arrow' right>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Another action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Something else here
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                  <tr>
                    <th scope='row'>
                      <Media className='align-items-center'>
                        {/* <a
                          className='avatar rounded-circle mr-3'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={
                              require('../../assets/img/theme/react.jpg')
                                .default
                            }
                          />
                        </a> */}
                        <Media>
                          <span className='mb-0 text-sm'>
                            React Material Dashboard
                          </span>
                        </Media>
                      </Media>
                    </th>
                    {/* <td>$4,400 USD</td>
                    <td>
                      <Badge color='' className='badge-dot'>
                        <i className='bg-info' />
                        on schedule
                      </Badge>
                    </td> */}
                    <td>
                      <div className='avatar-group'>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip875258217'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-1-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip875258217'
                        >
                          Ryan Tompson
                        </UncontrolledTooltip>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip834416663'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-2-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip834416663'
                        >
                          Romina Hadid
                        </UncontrolledTooltip>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip372449339'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-3-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip372449339'
                        >
                          Alexander Smith
                        </UncontrolledTooltip>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip108714769'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-4-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip108714769'
                        >
                          Jessica Doe
                        </UncontrolledTooltip>
                      </div>
                    </td>
                    <td>
                      <div className='d-flex align-items-center'>
                        <Button color='secondary' size='sm' type='button'>
                          accept
                        </Button>
                        <Button color='default' size='sm' type='button'>
                          reject
                        </Button>
                        {/* <span className='mr-2'>90%</span>
                        <div>
                          <Progress
                            max='100'
                            value='90'
                            barClassName='bg-info'
                          />
                        </div> */}
                      </div>
                    </td>
                    <td className='text-right'>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          className='btn-icon-only text-light'
                          href='#pablo'
                          role='button'
                          size='sm'
                          color=''
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className='fas fa-ellipsis-v' />
                        </DropdownToggle>
                        <DropdownMenu className='dropdown-menu-arrow' right>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Another action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Something else here
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                  <tr>
                    <th scope='row'>
                      <Media className='align-items-center'>
                        {/* <a
                          className='avatar rounded-circle mr-3'
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            src={
                              require('../../assets/img/theme/vue.jpg').default
                            }
                          />
                        </a> */}
                        <Media>
                          <span className='mb-0 text-sm'>
                            Vue Paper UI Kit PRO
                          </span>
                        </Media>
                      </Media>
                    </th>
                    {/* <td>$2,200 USD</td>
                    <td>
                      <Badge color='' className='badge-dot mr-4'>
                        <i className='bg-success' />
                        completed
                      </Badge>
                    </td> */}
                    <td>
                      <div className='avatar-group'>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip664029969'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-1-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip664029969'
                        >
                          Ryan Tompson
                        </UncontrolledTooltip>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip806693074'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-2-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip806693074'
                        >
                          Romina Hadid
                        </UncontrolledTooltip>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip844096937'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-3-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip844096937'
                        >
                          Alexander Smith
                        </UncontrolledTooltip>
                        <a
                          className='avatar avatar-sm'
                          href='#pablo'
                          id='tooltip757459971'
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt='...'
                            className='rounded-circle'
                            src={
                              require('../../assets/img/theme/team-4-800x800.jpg')
                                .default
                            }
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target='tooltip757459971'
                        >
                          Jessica Doe
                        </UncontrolledTooltip>
                      </div>
                    </td>
                    <td>
                      <div className='d-flex align-items-center'>
                        <span className='mr-2'>accepted!</span>
                        {/* <div>
                          <Progress
                            max='100'
                            value='100'
                            barClassName='bg-success'
                          />
                        </div> */}
                      </div>
                    </td>
                    <td className='text-right'>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          className='btn-icon-only text-light'
                          href='#pablo'
                          role='button'
                          size='sm'
                          color=''
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className='fas fa-ellipsis-v' />
                        </DropdownToggle>
                        <DropdownMenu className='dropdown-menu-arrow' right>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Another action
                          </DropdownItem>
                          <DropdownItem
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Something else here
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <CardFooter className='py-4'>
                <nav aria-label='...'>
                  <Pagination
                    className='pagination justify-content-end mb-0'
                    listClassName='justify-content-end mb-0'
                  >
                    <PaginationItem className='disabled'>
                      <PaginationLink
                        href='#pablo'
                        onClick={(e) => e.preventDefault()}
                        tabIndex='-1'
                      >
                        <i className='fas fa-angle-left' />
                        <span className='sr-only'>Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className='active'>
                      <PaginationLink
                        href='#pablo'
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href='#pablo'
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className='sr-only'>(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href='#pablo'
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href='#pablo'
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className='fas fa-angle-right' />
                        <span className='sr-only'>Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
