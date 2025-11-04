import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiService from "../services/apiService";
import "./AdminDashboard.css";


const AdminDashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 🧭 Fetch all posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await apiService.get(`/posts?page=${currentPage}&limit=10`);
                // Ensure we’re safely accessing nested data
                setPosts(response.data?.data?.posts || []);
                setTotalPages(response.data?.totalPages || 1);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
                setError("Failed to fetch the posts. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // 🗑️ Delete post handler
    const handleDelete = async (postId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this post?");
        if (!isConfirmed) return;

        try {
            await apiService.delete(`/posts/${postId}`);
            setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
            alert("✅ Post deleted successfully");
        } catch (error) {
            console.error("Failed to delete the post:", error);
            alert("❌ Failed to delete the post. Please try again later.");
        }
    };

    // 🌀 Loading state
    if (loading) {
        return <div className="loading-message">Loading Posts...</div>;
    }

    // ⚠️ Error state
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    // 🧩 Main UI
    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h2>Manage Posts</h2>
                <Link to="/admin/create-post" className="create-post-btn">
                    + Create New Post
                </Link>
            </div>

            <table className="posts-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Published Date</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <tr key={post._id}>
                                <td data-label="Title">{post.title}</td>
                                <td data-label="Author">{post.author}</td>
                                <td data-label="Published Date">{new Date(post.createdAt).toLocaleDateString()}</td>
                                <td data-label="Actions" className="action-buttons">
                                                    <Link
                                        to={`/admin/edit-post/${post.slug || post._id}`}
                                        className="btn edit-btn"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(post.slug || post._id)}
                                        className="btn delete-btn"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center" }}>
                                No posts found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            
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
        </div>
    );
};

export default AdminDashboard;
