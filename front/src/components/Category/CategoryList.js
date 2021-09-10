import React, { useEffect } from 'react';
import Main from './Main';
import { Card, Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LOAD_CATEGORY_REQUEST,
  //REMOVE_CATEGORY_REQUEST,
} from '../../reducer/post';
import { getLoginMember } from '../../helpers/authUtils';

const CategoryList = ({ post }) => {
  const dispatch = useDispatch();
  const { categoryList, hasMoreCategory, loadCategoryLoading } = useSelector(
    (state) => state.post
  );

  // 카테고리 삭제..
  // const onRemovePost = useCallback(() => {
  //   dispatch({
  //     type: REMOVE_CATEGORY_REQUEST,
  //     data: id,
  //   });
  // }, []);

  // 멤버 아이디 값 가져오기
  const memberId = getLoginMember().memberId;

  // 무한 스크롤
  useEffect(() => {
    dispatch({
      type: LOAD_CATEGORY_REQUEST,
      memberId,
    });
  }, [memberId]);

  console.log('카테고리 리스트여요', categoryList);

  // 멤버 데이터 받기..

  useEffect(() => {
    function onScroll() {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 150
      ) {
        if (hasMoreCategory && !loadCategoryLoading) {
          const lastId = categoryList[categoryList.length - 1]?.id;
          dispatch({
            type: LOAD_CATEGORY_REQUEST,
            lastId,
            memberId,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMoreCategory, loadCategoryLoading, categoryList, memberId]);

  // 카테고리 deletedAt 이 1인지 0인지 체크 해주자..나중에...
  if (categoryList.length >= 1) {
    return (
      <Main>
        <div className='header pb-8 pt-2 pt-md-7'>
          <Container fluid>
            <Link to='/admin/category/add'>
              <button className='btn btn-primary mb-4' type='button'>
                Add Category
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
                {categoryList.map((post) => {
                  if (post.MemberId) {
                    return (
                      <Col
                        key={post.id}
                        post={post}
                        lg='6'
                        xl='4'
                        className='postWrap'
                        style={{ marginBottom: '20px' }}
                      >
                        <Card className='card-stats mb-4 mb-xl-0'>
                          <Link
                            to={`/categories/${post.id}`}
                            categoryName={post.categoryName}
                          >
                            <div className='imageThumbnail'>
                              <img
                                src={`http://localhost:3003/${post.thumbnail}`}
                                alt={post.thumbnail}
                              />
                            </div>
                          </Link>
                        </Card>
                        <Link to={`/categories/${post.id}`}>
                          <p>{post.categoryName}</p>
                        </Link>
                        {/* <Button className='btn btn-danger' onClick={onRemovePost}>
                    삭제
                  </Button> */}
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
            <Link to='/category/add'>
              <button className='btn btn-primary mb-4' type='button'>
                Add Category
              </button>
            </Link>
          </Container>
          <Container className='firstPostWrap'>
            <div>
              <p>첫 여행 일기 카테고리를 작성해주세요</p>
              <span></span>
              <p>🛫</p>
            </div>
          </Container>
        </div>
      </Main>
    );
  }
};

export default CategoryList;
