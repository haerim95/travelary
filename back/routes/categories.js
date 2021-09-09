// 카테고리 목록, 포스트 목록 라우터
const express = require('express');
const { Op } = require('sequelize');

const { PostCategory, Member, Attachment, Post } = require('../models');
const router = express.Router({ mergeParams: true });

router.get('/', async (req, res, next) => {
  // GET /categories
  try {
    let where = { MemberId: req.query.memberId };
    if (parseInt(req.query.lastId, 10)) {
      console.log('라스트 아이디 if 실행 ㅎㅎ');
      // 초기 로딩이 아닐 때
      // lastid 가 parseInt(req.query.lastId, 10)보다 작은...
      where = {
        id: { [Op.lt]: parseInt(req.query.lastId, 10) },
        MemberId: req.query.memberId,
      };
      // where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }

    console.log('멤버 아이디?', parseInt(req.query.memberId, 10));
    console.log('라스트 아이디?', parseInt(req.query.lastId, 10));

    // const member = await Member.findOne({
    //   where: { id: parseInt(req.query.id, 10) },
    // });
    const categories = await PostCategory.findAll({
      where,
      limit: 9,
      order: [
        ['createdAt', 'DESC'], // 게시글 내림차순
      ],
      include: [
        {
          model: Member,
        },
        {
          model: Attachment,
        },
      ],
    }); // 모든 게시물 가져온다
    // console.log(categories);
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// post 들 불러오기
router.get('/:id', async (req, res, next) => {
  // GET /posts
  try {
    // 해당 카테고리가 있는지 확인
    const category = await PostCategory.findOne({
      where: { id: req.params.id },
    });
    if (!category) {
      return res.status(404).send('카테고리가 존재하지 않습니다.!!!!');
    }

    // 무한 스크롤링을 위한 코드
    let where = { PostCategoryId: parseInt(req.params.id, 10) };
    if (parseInt(req.query.lastId, 10)) {
      // 초기 로딩이 아닐 때
      // where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
      console.log('초기로딩이 아닐때 시작합니다~~~~~~~~~~', req.params.id);
      where = {
        id: { [Op.lt]: parseInt(req.query.lastId, 10) },
        PostCategoryId: parseInt(req.params.id, 10),
      };
    }

    console.log('카테고리 아이디?', parseInt(req.params.id, 10));
    console.log('라스트 아이디?', parseInt(req.query.lastId, 10));

    const posts = await Post.findAll({
      where,
      limit: 9,
      order: [
        ['createdAt', 'DESC'], // 게시글 내림차순
      ],
      include: [
        {
          model: Member,
        },
        {
          model: Attachment,
        },
        {
          model: PostCategory,
        },
      ],
    }); // 모든 게시물 가져온다
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// post 불러오기
router.get('/post/:id', async (req, res, next) => {
  // GET /posts
  try {
    const posts = await Post.findOne({
      where: { id: req.params.id },
    }); // 해당 아이디 값을 가진 게시물을 가져온다.
    console.log(posts);
    res.status(200).json({
      code: '200',
      posts,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
