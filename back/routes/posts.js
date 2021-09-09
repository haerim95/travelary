// 카테고리 목록 라우터
const express = require('express');
const { Op } = require('sequelize');

const { PostCategory, Member, Attachment } = require('../models');
const router = express.Router();

router.get('/', async (req, res, next) => {
  // GET /categories
  try {
    const where = {};
    if (parseInt(req.query.lastId, 9)) {
      // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 9) };
    }
    const posts = await PostCategory.findAll({
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
          model: PostCategory,
          attributes: ['id'],
        },
        {
          model: Attachment,
        },
      ],
    }); // 모든 게시물 가져온다
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
