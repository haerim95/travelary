import React, { useEffect } from 'react';
import { Card, Container, Row, Col } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_POST_REQUEST } from '../../reducer/post';
import Main from '../Category/Main';

const PostList = ({ match, categoryName }) => {
  const { postlist, hasMorePost, loadPostLoading } = useSelector(
    (state) => state.post
  );

  const { id } = useParams();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: LOAD_POST_REQUEST,
      id,
    });
  }, [id]);

  useEffect(() => {
    function onScroll() {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePost && !loadPostLoading) {
          const lastId = postlist[postlist.length - 1]?.id;
          dispatch({
            type: LOAD_POST_REQUEST,
            lastId,
            id,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePost, loadPostLoading, postlist]);

  if (postlist.length >= 1) {
    return (
      <Main>
        <div className='header pb-8 pt-2 pt-md-7'>
          <Container fluid>
            <Link to={`/${id}/post/add`}>
              {/* <Link to={`/admin/post/add`}> */}
              <button className='btn btn-primary mb-4' type='button'>
                Add Post
              </button>
            </Link>
          </Container>

          <Container fluid>
            <div className='mb-4 noticeMent'>
              <p>Please record your trip. 😘</p>
            </div>
            <div className='header-body'>
              {/* Card stats */}
              <Row>
                {postlist.map((post) => {
                  const categoryId = window.location.href
                    .split('/')
                    .reverse()[0];
                  if (categoryId == post.PostCategoryId) {
                    return (
                      <Col key={post.id} lg='6' xl='4' className='postWrap'>
                        <Card className='card-stats mb-4 mb-xl-0'>
                          <Link to={`/admin/post/${post.id}`}>
                            <div className='imageThumbnail'>
                              <img
                                alt='...'
                                src={`http://localhost:3003/${post.thumbnail}`}
                              />
                            </div>
                          </Link>
                        </Card>
                        <Link to='/admin/post/view'>
                          <p>{post.title}</p>
                        </Link>
                      </Col>
                    );
                  }
                })}
              </Row>
            </div>
          </Container>
        </div>
      </Main>
    );
  } else {
    return (
      <Main>
        <div className='header pb-8 pt-2 pt-md-7'>
          {/* 유저가 아무런 카테고리를 작성하지 않았을 때 */}
          <Container fluid>
            <Link to={`/${id}/post/add`}>
              <button className='btn btn-primary mb-4' type='button'>
                Add Post
              </button>
            </Link>
          </Container>
          <Container className='firstPostWrap'>
            <div>
              <p>첫 여행 일기를 작성해주세요</p>
              <span></span>
              <p>🛫</p>
            </div>
          </Container>
        </div>
      </Main>
    );
  }
};

export default PostList;
