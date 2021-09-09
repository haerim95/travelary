import React from 'react';
import { useLocation, Route, Switch, Redirect } from 'react-router-dom';
// reactstrap components
import { Container } from 'reactstrap';
// core components
import AdminNavbar from '../Navbars/AdminNavbar.js';
import AdminFooter from '../Footers/AdminFooter.js';
import Sidebar from '../Sidebar/Sidebar.js';
import PostBg from '../Headers/PostBg';

// import routes from 'routes.js';

const Main = ({ children, props }) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  React.useEffect(() => {
    document.body.classList.add('bg-default');
    return () => {
      document.body.classList.remove('bg-default');
    };
  }, []);

  // const getRoutes = (routes) => {
  //   return routes.map((prop, key) => {
  //     if (prop.layout === '/admin') {
  //       return (
  //         <Route
  //           path={prop.layout + prop.path}
  //           component={prop.component}
  //           key={key}
  //         />
  //       );
  //     } else {
  //       return null;
  //     }
  //   });
  // };

  // const getBrandText = (path) => {
  //   for (let i = 0; i < routes.length; i++) {
  //     if (
  //       props.location.pathname.indexOf(routes[i].layout + routes[i].path) !==
  //       -1
  //     ) {
  //       return routes[i].name;
  //     }
  //   }
  //   return 'Brand';
  // };

  // const getBreadcrumb = () => {
  //   for (let i = 0; i < routes.length; i++) {
  //     if (
  //       props.location.pathname.indexOf(routes[i].layout + routes[i].path) !==
  //       -1
  //     ) {
  //       return routes[i].breadcrumb;
  //     }
  //   }
  // };

  // /post/view/ url 일때만 보이는 백그라운드임.
  const PostViewHeader = () => {
    if (window.location.pathname === '/admin/post/view')
      return (
        <div className='pt-7'>
          <PostBg />
        </div>
      );
    return null;
  };

  return (
    <>
      <Sidebar
        {...props}
        // routes={routes}
        logo={{
          innerLink: '/admin/index',
          imgAlt: '...',
        }}
      />
      <div className='main-content' ref={mainContent}>
        <AdminNavbar
          {...props}
          // brandText={getBrandText(props.location.pathname)}
          // breadcrumb={getBreadcrumb(props.location.pathname)}
        />

        {/* post view 페이지에만 나오는 헤더영역 */}
        {PostViewHeader()}

        <div style={{ margin: 'auto', maxWidth: '1200px' }}>
          <Switch>
            {/* {getRoutes(routes)} */}
            {children}
            {/* <Redirect from='*' to='/admin/index' /> */}
          </Switch>
        </div>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Main;
