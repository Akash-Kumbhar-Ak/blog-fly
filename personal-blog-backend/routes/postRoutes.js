// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
// HIGHLIGHT START
// 1. Import the 'protect' middleware from our authMiddleware file.
const { protect } = require('../middleware/authMiddleware');
// HIGHLIGHT END

// --- PUBLIC ROUTES ---
// These routes are for reading data and should be accessible to everyone.
// GET all posts
router.get('/', postController.getAllPost);
// GET posts by category (must be before /:slug route)
router.get('/category/:categoryName', postController.getPostsByCategory);
// GET a single post by its ID
router.get('/:slug', postController.getPostById);


router.post('/', protect, postController.createPost);
// HIGHLIGHT END

// PUT (update) an existing post by its ID
// HIGHLIGHT START
router.patch('/:slug', protect, postController.updatePost);
// HIGHLIGHT END

// DELETE a post by its ID
// HIGHLIGHT START
router.delete('/:slug', protect, postController.deletePost);
// HIGHLIGHT END

module.exports = router;