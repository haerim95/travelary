// ! 로그인, 회원가입 등 별도 페이지의 네비바

import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/fontawesome-free';
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  InputGroup,
  InputGroupText,
} from 'reactstrap';

const Navigation = () => {
  return (
    <>
      <Nav navbar>
        <NavItem>
          <NavLink href=''>
            <i className='ni ni-collection'></i>
            My Travelary
          </NavLink>
          <NavItem>
            <NavLink href=''>
              <i className='ni ni-world-2'></i>
              Share Travelary
              {/* <FontAwesomeIcon /> */}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href=''>
              <i className='ni ni-single-02'></i>
              Profile
              {/* <FontAwesomeIcon /> */}
            </NavLink>
          </NavItem>
        </NavItem>
      </Nav>
    </>
  );
};

export default Navigation;
