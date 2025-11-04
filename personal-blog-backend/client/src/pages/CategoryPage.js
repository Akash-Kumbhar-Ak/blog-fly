// client/src/pages/CategoryPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../services/apiService';
import PostListItem from '../components/PostListItem';
import './HomePage.css';



const CategoryPage = () => {
  // Extract category name from the URL parameter
  const { categoryName } = useParams();

  // State management
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch posts when category changes
  useEffect(() => {
    const fetchPostsByCategory = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch posts from the backend by category
        const response = await apiService.get(`/posts/category/${categoryName}`);
        setPosts(response.data);
      } catch (err) {
        console.error(`Failed to fetch posts for category ${categoryName}:`, err);
        setError('Could not load posts for this category. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostsByCategory();
  }, [categoryName]); // Re-run when categoryName changes

  // --- UI Rendering ---

  if (loading) {
    return <div className="loading-message">Loading posts...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="homepage">
      <div className="posts-container">
        <div className="posts-header">
          <h2 className="posts-title">Posts in "{categoryName}"</h2>
        </div>
        
        {posts.length === 0 ? (
          <div className="no-posts">
            <h3>No posts found</h3>
            <p>No posts found in this category yet.</p>
          </div>
        ) : (
          <div className="post-list">
            {posts.map(post => <PostListItem key={post._id} post={post} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
