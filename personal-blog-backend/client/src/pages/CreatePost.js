import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import './CreatePost.css';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [markDownContent, setMarkDownContent] = useState('');
    const [categories, setCategories] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        if (!title.trim() || !markDownContent.trim()) {
            setError('Title and content are required');
            setLoading(false);
            return;
        }

        const categoriesArray = categories.split(',').map(cat => cat.trim()).filter(cat => cat);

        try {
            await apiService.post('/posts', {
                title,
                markdownContent: markDownContent,
                categories: categoriesArray,
                author: 'Admin'
            });
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Failed to create the post ', error);
            setError(error.response?.data?.message || 'Failed to create the post . Please try again later');
            setLoading(false);


        }
    };



    return (
        <>
            <div className="create-post-page">
                <h2>Create New Post</h2>
                <form onSubmit={handleSubmit} className="create-post-form">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text"
                            id="title"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter Post title "
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="markDownContent">
                            Content(Markdown)
                        </label>
                        <textarea
                            id="markDownContent"
                            className='form-control markdown-input'
                            value={markDownContent}
                            onChange={(e) => setMarkDownContent(e.target.value)}
                            placeholder="Write your content here using the markdown....."
                            disabled={loading}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="categories">Categories (comma-separated)</label>
                        <input
                            type="text"
                            id="categories"
                            className="form-control"
                            value={categories}
                            onChange={(e) => setCategories(e.target.value)}
                            placeholder="e.g., React, Web Development, Tutorial"
                            disabled={loading}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Publishing ' : 'Publish Post'}
                    </button>

                </form>
            </div>
        </>
    )
};
export default CreatePost;