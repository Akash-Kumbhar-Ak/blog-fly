const Post = require('../models/postModel');

// --------------------------------------------------
// CREATE POST (updated to handle categories & author)
// --------------------------------------------------
exports.createPost = async (req, res) => {
  try {
    const { title, markdownContent, categories, author } = req.body;

    // Create new post with categories & author
    const newPost = await Post.create({
      title,
      markdownContent,
      categories, // array from frontend
      author,
    });

    res.status(201).json({
      status: 'success',
      data: { post: newPost },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Error creating post',
      error: error.message,
    });
  }
};

// --------------------------------------------------
// GET ALL POSTS (pagination support)
// --------------------------------------------------
exports.getAllPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: 'success',
      results: posts.length,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
      data: { posts },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// --------------------------------------------------
// GET POST BY SLUG OR ID
// --------------------------------------------------
exports.getPostById = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || slug === 'undefined') {
      return res.status(400).json({
        status: 'fail',
        message: 'Post slug or ID is required',
      });
    }

    let post = await Post.findOne({ slug });
    if (!post) post = await Post.findById(slug);

    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'No post found with that slug or ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { post },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// HIGHLIGHT START
// NEW function to fetch all posts that belong to a specific category.
exports.getPostsByCategory = async (req, res) => {
  try {
    // 1. Extract the category name from the URL parameters.
    // This 'categoryName' corresponds to the ':categoryName' in our route definition.
    const categoryName = req.params.categoryName;

    // 2. Use Mongoose's find() method to query the database.
    // We are looking for all documents where the 'categories' array field
    // contains the string value of 'categoryName'.
    // Mongoose is smart enough to search for a value within the array.
    const posts = await Post.find({ categories: categoryName })
      .sort({ createdAt: -1 }); // Optional: sort the results by newest first.

    // 3. If no posts are found for a category, Mongoose returns an empty array.
    // This is a valid result, not an error. We simply return the empty array.

    // 4. Send the found posts back to the client with a 200 OK status.
    res.status(200).json(posts);
  } catch (error) {
    // Handle potential server errors (e.g., database connection issue).
    res.status(500).json({ message: 'Error fetching posts by category', error: error.message });
  }
};





// --------------------------------------------------
// UPDATE POST (updated to handle categories)
// --------------------------------------------------
exports.updatePost = async (req, res) => {
  try {
    const { title, markdownContent, categories } = req.body;

    const updatedData = {
      title,
      markdownContent,
      categories, // add categories support
    };

    // Update by slug (preferred) or by ID
    let updatedPost = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true, runValidators: true }
      );
    }

    if (!updatedPost) {
      return res.status(404).json({
        status: 'fail',
        message: 'Post not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { post: updatedPost },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Error updating post',
      error: error.message,
    });
  }
};

// --------------------------------------------------
// DELETE POST
// --------------------------------------------------
exports.deletePost = async (req, res) => {
  try {
    const { slug } = req.params;

    // Try to delete by slug first, then by ID
    let post = await Post.findOneAndDelete({ slug });
    if (!post) {
      post = await Post.findByIdAndDelete(slug);
    }

    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'No post found with that slug or ID',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
