const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET /posts - Get all blog posts with optional search filter
router.get('/', async (req, res, next) => {
  try {
    const searchTerm = req.query.search || '';
    const posts = await Post.getAll(searchTerm);
    
    res.json({
      message: 'Posts retrieved successfully',
      data: posts,
      count: posts.length
    });
  } catch (error) {
    next(error);
  }
});

// GET /posts/:id - Get single blog post
router.get('/:id', async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.getById(postId);
    
    if (!post) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Post not found'
      });
    }
    
    res.json({
      message: 'Post retrieved successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
});

// POST /posts - Create new blog post
router.post('/', async (req, res, next) => {
  try {
    const { title, content, author } = req.body;

    // Validation
    if (!title || !content || !author) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Title, content, and author are required'
      });
    }

    const newPost = await Post.create({ title, content, author });
    
    res.status(201).json({
      message: 'Post created successfully',
      data: newPost
    });
  } catch (error) {
    next(error);
  }
});

// PUT /posts/:id - Update entire blog post
router.put('/:id', async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { title, content, author } = req.body;

    // Validation
    if (!title || !content || !author) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Title, content, and author are required'
      });
    }

    const result = await Post.update(postId, { title, content, author });
    
    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Post not found'
      });
    }
    
    res.json({
      message: 'Post updated successfully',
      data: { id: postId, title, content, author }
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /posts/:id - Partially update blog post
router.patch('/:id', async (req, res, next) => {
  try {
    const postId = req.params.id;
    const updates = req.body;

    // First get the current post
    const currentPost = await Post.getById(postId);
    
    if (!currentPost) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Post not found'
      });
    }

    // Merge updates with current post
    const updatedPost = { ...currentPost, ...updates };
    await Post.update(postId, updatedPost);
    
    res.json({
      message: 'Post updated successfully',
      data: updatedPost
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /posts/:id - Delete blog post
router.delete('/:id', async (req, res, next) => {
  try {
    const postId = req.params.id;
    const result = await Post.delete(postId);
    
    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Post not found'
      });
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /posts/author/:author - Get posts by specific author
router.get('/author/:author', async (req, res, next) => {
  try {
    const author = req.params.author;
    const posts = await Post.getByAuthor(author);
    
    res.json({
      message: `Posts by ${author} retrieved successfully`,
      data: posts,
      count: posts.length
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;