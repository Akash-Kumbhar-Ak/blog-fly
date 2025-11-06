// models/postModel.js

const mongoose = require('mongoose');
// HIGHLIGHT START
// 1. Import the slugify library that we installed.
const slugify = require('slugify');
// HIGHLIGHT END

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A post must have a title'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    markdownContent: {
      type: String,
      required: [true, 'A post must have content'],
    },
    categories:{
      type:[String],
      default:[],
    },
    author: {
      type: String,
      default: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

// Add database indexes for better performance
postSchema.index({ slug: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ categories: 1 });
postSchema.index({ author: 1 });

postSchema.pre('save', function(next) {
  // Handle field name compatibility
  if (this.markDownContent && !this.markdownContent) {
    this.markdownContent = this.markDownContent;
    this.markDownContent = undefined;
  }
  
  // Generate slug from title
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Add indexes for better performance
postSchema.index({ createdAt: -1 });
postSchema.index({ categories: 1 });
postSchema.index({ slug: 1 });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;