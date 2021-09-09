const express = require('express');

const { PostCategory, Post, Attachment } = require('../models');

const router = express.Router();

router.post('/:postCategoryId/post', async (req, res, next) => {
  try {
    const postCategory = await PostCategory.create({
      title: req.body.title,
      content: req.body.content,
      CategoryId: req.params.postCategoryId,
    });

    if (!category) {
      return res.status(403).send('카테고리가 존재하지 않습니다.');
    }

    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(
          req.body.image.map((image) => Attachment.create({ src: image }))
        );
        await postCategory.addImages(images);
      } else {
        const images = await Attachment.create({ src: req.body.image });
        await postCategory.addImages(images);
      }
    }

    const fullCategory = await PostCategory.findeOne({
      where: { id: postCategory.id },
      include: [
        {
          model: Attachment,
        },
      ],
    });

    res.status(201).json(fullCategory);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postCategoryId', async (req, res, next) => {
  try {
    await PostCategory.destroy({
      where: { id: req.params.postCategoryId },
    });
    res.json({ PostCategoryId: req.params.postCategoryId });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
