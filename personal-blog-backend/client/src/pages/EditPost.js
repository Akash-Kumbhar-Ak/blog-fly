import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import apiService from "../services/apiService";
import "./CreatePost.css";

const EditPost = () => {
  const { slug } = useParams();

  const [title, setTitle] = useState("");
  const [markDownContent, setMarkDownContent] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // ✅ Missing function call inside useEffect
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${slug}`);

        // adjust depending on your API response structure
        const post = response.data.data?.post || response.data;
        setTitle(post.title);
        setMarkDownContent(post.markdownContent || post.markDownContent || '');
        if (response.data.categories && Array.isArray(response.data.categories)) {
          setCategories(response.data.categories.json(','));
        }
      } catch (error) {
        console.error("Failed to fetch the post for editing:", error);
        console.error("Error details:", error.response?.data);
        console.error("Status:", error.response?.status);
        setError(`Failed to fetch the post for editing. ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPost(); // 👈 This line was missing earlier
  }, [slug]);

  // 🧾 Form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const categoriesArray = categories.split(',').map(cat => cat.trim()).filter(cat => cat);

    if (!title.trim() || !markDownContent.trim()) {
      setError("Title and Content are required.");
      setSubmitting(false);
      return;
    }

    try {
      await apiService.patch(`/posts/${slug}`, {
        title,
        markdownContent: markDownContent,
        categories: categoriesArray
      });

      alert("✅ Post updated successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Failed to update post:", error);
      setError(
        error.response?.data?.message ||
        "Failed to update the post. Please try again later."
      );
      setSubmitting(false);
    }
  };

  // ⏳ Loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading Post...
      </div>
    );
  }

  // 🧩 Form UI
  return (
    <div className="create-post-page">
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="markDownContent">Content (Markdown)</label>
          <textarea
            id="markDownContent"
            className="form-control markdown-input"
            value={markDownContent}
            onChange={(e) => setMarkDownContent(e.target.value)}
            disabled={submitting}
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
            disabled={submitting}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? "Updating Post..." : "Update Post"}
        </button>
      </form>
    </div>
  );
};

export default EditPost;
