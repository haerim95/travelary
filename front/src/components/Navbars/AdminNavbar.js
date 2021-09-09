// ! 메인 페이지의 네비바
import React, { useState, useEffect } from 'react';

import { Link, useHistory } from 'react-router-dom';
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
  NavItem,
} from 'reactstrap';

//각종 유틸리티 함수를 참조한다.
import {
  getJWTToken,
  isMemberLogined,
  getLoginMember,
} from '../../helpers/authUtils';

const AdminNavbar = (props) => {
  const history = useHistory();

  //사용자 로그아웃 처리 - 로컬 스토리지를 삭제한다.
  const logOut = () => {
    if (window.confirm('Are you sure to log-out?') === true) {
      window.localStorage.removeItem('jwtToken');
      window.localStorage.removeItem('loginMemberInfo');

      history.push('/auth');
    } else {
      return;
    }
  };

  return (
    <>
      <Navbar className='navbar-top navbar-dark' expand='md' id='navbar-main'>
        <Container fluid>
          {/* page title 명 뜨는 상단 타이틀 부분  */}
          {/* Admin.js에서 getBrandText()로 routes에 있는 타이틀 텍스트를 불러온다. */}
          <Link className='h4 mb-0 d-none d-lg-inline-block' to='/'>
            {/* {props.breadcrumb} */}
          </Link>

          {/* 검색창 */}
          <Form className='navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto'>
            <FormGroup className='mb-0'>
              <InputGroup className='input-group-alternative'>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <i className='fas fa-search' />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder='Search' type='text' />
              </InputGroup>
            </FormGroup>
          </Form>

          {/* 알림창 영역입니다. */}
          <Nav className='align-items-center right-alram'>
            <UncontrolledDropdown nav>
              <DropdownToggle nav className='nav-link-icon'>
                <i className='ni ni-bell-55' />
                <span className='badge badge-default'>7</span>
              </DropdownToggle>
              <DropdownMenu
                aria-labelledby='navbar-default_dropdown_1'
                className='dropdown-menu-arrow'
                right
              >
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Something else here</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            {/* 로그아웃 버튼 */}
            <DropdownToggle nav>
              <i className='ni ni-button-power' onClick={logOut} />
              {/* <span class='badge badge-default'></span> */}
            </DropdownToggle>
          </Nav>

          {/* 유저 상단바 끝 */}
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
