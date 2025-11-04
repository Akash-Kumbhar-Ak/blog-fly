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

const Post = mongoose.model('Post', postSchema);

module.exports = Post;