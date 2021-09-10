import React, { useState, useEffect } from 'react';
import axios from 'axios';
// reactstrap components
import { Card, CardBody, CardHeader, Container, Row, Col } from 'reactstrap';
import { useHistory, useParams, Link } from 'react-router-dom';
import DeleteModal from './DeleteModal';
import Main from '../Category/Main';

const Post = () => {
  const [postContent, setPostContent] = useState({
    title: '',
    contnet: '',
  });
  const [postIdx, setPostIdx] = useState(0);
  const history = useHistory();

  // 파라메터로 전달되는 와일드 카드 변수명으로 전달되는 값을 받아온다.
  const { id } = useParams();

  useEffect(() => {
    setPostIdx(id);
    axios
      .get(`/categories/post/${id}`)
      .then((res) => {
        // console.log('백엔드에서 제공된 전체 데이터 구조파악:', res);
        if (res.data.code === '200') {
          //게시글 세터함수를 통해 백엔드에서 전달된 json을 데이터로 갱신한다.
          console.log(res.data.posts);
          setPostContent(res.data.posts);
        } else {
          alert('백엔드 호출 에러 발생');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // 목록 이동
  const onMovePostList = () => {
    history.goBack();
  };

  const bgImgaeUrl = 'http://localhost:3003/';

  return (
    <>
      <Main>
        {/* 배경 백그라운드 이미지로 까는거 잊지 말기 */}
        <div
          className='header postViewWrap pb-8 pt-md-6'
          style={{ width: '100%' }}
        >
          <div
            className='header postHeader'
            style={{
              width: '100%',
              backgroundImage: `url( ${bgImgaeUrl}${postContent.thumbnail})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          >
            <div className='bg-gradient-info pb-8 pt-5 pt-md-8'></div>
          </div>
          <Container className='mt--7' fluid>
            <Row>
              <Col className='mb-5 mb-xl-0' xl='12'>
                <Card className='shadow'>
                  {}
                  <CardHeader className='bg-transparent'>
                    <Row className='align-items-center postHeader pl-3 pr-3'>
                      <h3>{postContent.title}</h3>
                      <div>
                        <button
                          className='btn btn-secondary'
                          onClick={onMovePostList}
                        >
                          목록
                        </button>
                        <Link
                          style={{ marginRight: '.5rem' }}
                          to={`/admin/modify/${id}`}
                        >
                          <button className='btn btn-primary'>수정</button>
                        </Link>
                        <DeleteModal />
                      </div>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <div
                      dangerouslySetInnerHTML={{ __html: postContent.content }}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </Main>
    </>
  );
};

export default Post;
