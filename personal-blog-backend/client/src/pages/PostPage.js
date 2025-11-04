import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiService from "../services/apiService";
import ReactMarkdown from "react-markdown";
import '../markdown-styles.css';
import CategoryTag from "../components/CategoryTag";

const PostPage = () => {

    const { slug } = useParams();

    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug || slug === 'undefined') {
                window.location.href = '/';
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await apiService.get(`/posts/${slug}`);
                const post = response.data.data.post;
                setPost(post);

            } catch (error) {

                if (error.response && error.response.status === 404) {
                    setError('Post Not Found');
                } else {
                    setError(`Failed to Load the Post: ${error.response?.data?.message || error.message}`);
                }

            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [slug]);

    const createMetaDescription = (markdown) => {
        if (!markdown) return '';
        // Remove Markdown formatting and trim to a suitable length (e.g., 155 chars).
        const plainText = markdown
            .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Keep link text
            .replace(/[`*#_~]/g, '') // Remove markdown characters
            .replace(/\s+/g, ' '); // Normalize whitespace

        return plainText.substring(0, 155).trim() + '...';
    };


    if (loading) {
        return <div>Loading Post...</div>
    }
    if (error) {
        return (
            <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>
                Error: {error}
            </div>
        )
    }

    if (!post) {
        return (
            <div>
                <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>
                    No Post Found
                </div>
            </div>
        )
    }

    const categoriesContainerStyle = {
        marginTop: '1rem',
        marginBottom: '1rem',
        borderBottom: '1px solid #eee',
        paddingBottom: '1rem'
    };


    return (
        <>
            <article className="post-full">

                <h1>{post.title}</h1>

                <div className="post-full-meta">
                    <span>Author Name: {post.author}</span>
                    <span>Created At {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                {/* HIGHLIGHT START */}
                {/* 2. Add the exact same conditional rendering and mapping logic here.
           This is the beauty of a reusable component! */}
                {post.categories && post.categories.length > 0 && (
                    <div style={categoriesContainerStyle}>
                        {post.categories.map(category => (
                            <CategoryTag key={category} category={category} />
                        ))}
                    </div>
                )}
                {/* HIGHLIGHT END */}

                <div className="post-full-content">
                    <ReactMarkdown>
                        {post.markdownContent || post.markDownContent || 'No content available'}
                    </ReactMarkdown>
                </div>

            </article>
        </>

    )
}

export default PostPage;