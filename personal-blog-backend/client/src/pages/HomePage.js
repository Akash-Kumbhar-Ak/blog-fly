import React, { useEffect, useState } from "react";
import apiService from "../services/apiService";
import PostListItem from "../components/PostListItem";

import './HomePage.css';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/posts?page=${currentPage}&limit=3`);
        setPosts(response.data.data.posts);
        setTotalPages(response.data.totalPages);
        setTotalPosts(response.data.totalPosts);
        setError(null);
      } catch (error) {
        console.error("Error fetching posts:", error);
        if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
          setError("Network error. Please check your connection and try again.");
        } else if (error.response?.status === 500) {
          setError("Server error. Please try again in a few moments.");
        } else {
          setError(`Failed to fetch posts: ${error.response?.data?.message || error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading posts...</p>
    </div>
  );
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="home-page">

      <div className="hero-section">
        <h1 className="hero-title">Welcome to Our Blog</h1>
        <p className="hero-subtitle">Discover amazing stories, insights, and ideas</p>
      </div>
      
      <div className="posts-container">
        <div className="posts-header">
          <h2 className="posts-title">Latest Posts</h2>
        </div>
        
        {posts.length === 0 ? (
          <div className="no-posts">
            <h3>No posts yet</h3>
            <p>Be the first to create an amazing post!</p>
          </div>
        ) : (
          <>
            <div className="post-list">
              {posts.map(post=>(
                <PostListItem key={post._id} post={post}/>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                <div className="page-numbers">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        className={`btn ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button 
                  className="btn btn-secondary" 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;