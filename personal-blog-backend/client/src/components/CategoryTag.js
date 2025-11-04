// client/src/components/CategoryTag.js

import React from 'react';
import './CategoryTag.css'; // Import the stylesheet
import { Link } from 'react-router-dom';

// This is a simple presentational component.
// It receives a 'category' string as a prop and displays it.
// For now, it's just a span. In a future task, we will upgrade it to be a Link.
const CategoryTag = ({ category }) => {
  return (
   <Link to={`/category/${category}`} className="category-tag">
      {category}
    </Link>
  );
};

export default CategoryTag;