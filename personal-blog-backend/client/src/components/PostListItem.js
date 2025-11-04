import React from "react";
import { Link } from "react-router-dom";
import CategoryTag from "./CategoryTag";
import './PostListItem.css';

const PostListItem = ({ post }) => {

    const snippet = (post.markdownContent || post.markDownContent || '').replace(/[#*`]/g, '').substring(0, 150) + '...';

    const categoriesContainerStyle = {
        marginTop: '10px',
    };
    return (
        <>
            <Link to={`/post/${post.slug || post._id}`} className="post-link">
                <article className="post-list-item">
                    <h2>{post.title}</h2>
                    <div className="post-meta">
                        <span>{post.author}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    {/* HIGHLIGHT START */}
                    {/* 2. Conditionally render the categories container.
           We only show this section if the 'categories' array exists AND it's not empty.
           This is a crucial check to prevent errors for posts without categories. */}
                    {post.categories && post.categories.length > 0 && (
                        <div style={categoriesContainerStyle}>
                            {/* 3. Map over the categories array. For each category string,
               render our reusable CategoryTag component.
               The category string itself makes a good unique 'key'. */}
                            {post.categories.map(category => (
                                <CategoryTag key={category} category={category} />
                            ))}
                        </div>
                    )}
                    {/* HIGHLIGHT END */}
                    <p>{snippet}</p>
                    <div className="read-more">Read more →</div>
                </article>
            </Link>
        </>
    )
}
export default PostListItem;    