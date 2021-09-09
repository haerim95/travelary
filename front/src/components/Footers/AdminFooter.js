import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap';

const Footer = () => {
  return (
    <footer className='footer'>
      <Row className='align-items-center justify-content-xl-between'>
        <Col xl='6'>
          <div className='copyright text-center text-xl-left text-muted'>
            <a href='https://github.com/reactstrap/reactstrap'>
              Travelary Repository
            </a>
            <span
              style={{ display: 'inline-block', marginLeft: '10px' }}
              className='copyright text-center text-xl-left text-muted'
            >
              @Template by <b>argon</b>
            </span>
          </div>
        </Col>
        {/* <NavItem>
          <NavLink href='https://github.com/reactstrap/reactstrap'>
            <img
              alt='...'
              style={{ width: '18px', height: '18px' }}
              src={require('../../assets/img/icons/common/github.svg').default}
            />
            GitHub
          </NavLink>
        </NavItem> */}
        {/* <Col xl="6">
          <Nav className="nav-footer justify-content-center justify-content-xl-end">
            <NavItem>
              <NavLink
                href="https://www.creative-tim.com?ref=adr-admin-footer"
                rel="noopener noreferrer"
                target="_blank"
              >
                Creative Tim
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="https://www.creative-tim.com/presentation?ref=adr-admin-footer"
                rel="noopener noreferrer"
                target="_blank"
              >
                About Us
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="http://blog.creative-tim.com?ref=adr-admin-footer"
                rel="noopener noreferrer"
                target="_blank"
              >
                Blog
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="https://github.com/creativetimofficial/argon-dashboard/blob/master/LICENSE.md?ref=adr-admin-footer"
                rel="noopener noreferrer"
                target="_blank"
              >
                MIT License
              </NavLink>
            </NavItem>
          </Nav>
        </Col> */}
      </Row>
    </footer>
  );
};

export default Footer;
