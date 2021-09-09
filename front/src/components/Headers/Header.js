// ! main page 상단 헤더 영역
// ! 붙어다니는 상단 헤더영역이다....1번 메뉴, 2번, 3번 메뉴까지 얘가 같이 나옴...

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const Header = () => {
  return (
    <>
      {/* <div className="header bg-gradient-info pb-8 pt-5 pt-md-8"> */}
      <div className='header pb-8 pt-5 pt-md-8'>
        <Container fluid>
          <div className='mb-4'>
            <h3>뭔가...멘트가 필요할거같은데 뭐가 좋을지 잘 모르겠넹...</h3>
          </div>
          <div className='header-body'>
            {/* Card stats */}
            <Row>
              <Col lg='6' xl='4'>
                <Card className='card-stats mb-4 mb-xl-0'>
                  <div className='imageThumbnail'>
                    <img
                      alt='...'
                      src={
                        require("../../assets/img/theme/team-4-800x800.jpg")
                          .default
                      }
                    />
                  </div>
                </Card>
                <p>와 진짜 너무 졸리다....꿈나라 여행 간 후기</p>
              </Col>
              <Col lg='6' xl='4'>
                <Card className='card-stats mb-4 mb-xl-0'>
                  <CardBody>
                    <Row>
                      <div className='col'>
                        <CardTitle
                          tag='h5'
                          className='text-uppercase text-muted mb-0'
                        >
                          New users
                        </CardTitle>
                        <span className='h2 font-weight-bold mb-0'>2,356</span>
                      </div>
                      <Col className='col-auto'>
                        <div className='icon icon-shape bg-warning text-white rounded-circle shadow'>
                          <i className='fas fa-chart-pie' />
                        </div>
                        <p className='dsd'></p>
                      </Col>
                    </Row>
                    <p className='mt-3 mb-0 text-muted text-sm'>
                      <span className='text-danger mr-2'>
                        <i className='fas fa-arrow-down' /> 3.48%
                      </span>{" "}
                      <span className='text-nowrap'>Since last week</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg='6' xl='4'>
                <Card className='card-stats mb-4 mb-xl-0'>
                  <CardBody>
                    <Row>
                      <div className='col'>
                        <CardTitle
                          tag='h5'
                          className='text-uppercase text-muted mb-0'
                        >
                          Sales
                        </CardTitle>
                        <span className='h2 font-weight-bold mb-0'>924</span>
                      </div>
                      <Col className='col-auto'>
                        <div className='icon icon-shape bg-yellow text-white rounded-circle shadow'>
                          <i className='fas fa-users' />
                        </div>
                      </Col>
                    </Row>
                    <p className='mt-3 mb-0 text-muted text-sm'>
                      <span className='text-warning mr-2'>
                        <i className='fas fa-arrow-down' /> 1.10%
                      </span>{" "}
                      <span className='text-nowrap'>Since yesterday</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
