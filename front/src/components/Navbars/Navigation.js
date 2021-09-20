import { NavItem, NavLink, Nav } from 'reactstrap';

const Navigation = () => {
  return (
    <>
      <Nav navbar>
        <NavLink href='/'>
          <i className='ni ni-collection'></i>
          My Travelary
        </NavLink>
        <NavItem>
          <NavLink href='/'>
            <i className='ni ni-world-2'></i>
            Share Travelary
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href='/profile'>
            <i className='ni ni-single-02'></i>
            Profile
          </NavLink>
        </NavItem>
      </Nav>
    </>
  );
};

export default Navigation;
