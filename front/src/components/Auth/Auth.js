import React from 'react';
import { useLocation, Route, Switch, Redirect } from 'react-router-dom';
// reactstrap components
import { Container, Row, Col, NavbarBrand } from 'reactstrap';
import Register from './Register';

// core components
import AuthFooter from '../Footers/AuthFooter.js';
import Login from './Login';

const Auth = ({ children }) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.body.classList.add('bg-default');
    return () => {
      document.body.classList.remove('bg-default');
    };
  }, []);
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === '/auth') {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <div className='main-content' ref={mainContent}>
        {/* <AuthNavbar /> */}
        {/* <div className='header bg-gradient-info py-7 py-lg-8'> */}
        <div className='header py-7 py-lg-8'>
          <Container>
            <div className='header-body text-center mb-4'>
              <Row className='justify-content-center'>
                <Col lg='5' md='6'>
                  {/* Brand */}

                  <h1 className='logo-default'>Travelary</h1>
                  {/* <p className="text-lead text-light">
                    Use these awesome forms to login or create new account in
                    your project for free.
                  </p> */}
                </Col>
              </Row>
            </div>
          </Container>
          <div className='separator separator-bottom separator-skew zindex-100'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              preserveAspectRatio='none'
              version='1.1'
              viewBox='0 0 2560 100'
              x='0'
              y='0'
            >
              {/* <polygon
                className='fill-default'
                points='2560 0 2560 100 0 100'
              /> */}
            </svg>
          </div>
        </div>
        {/* Page content */}
        <Container className='mt--8 pb-5'>
          <Row className='justify-content-center'>
            <Switch>
              {/* {getRoutes(routes)} */}
              {/* <Redirect from='*' to='/auth/login' /> */}
              {children}
            </Switch>
          </Row>
        </Container>
      </div>
      <AuthFooter />
    </>
  );
};

export default Auth;
