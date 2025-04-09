// import React from 'react'
// import PropTypes from 'prop-types';

// const CategoryList = ({ categories, onCategorySelect })=> {
//     return (
//       <div className="mb-4">
//         <h2 className="text-xl font-semibold mb-2">Select a Category</h2>
//         <ul>
//           {categories.map(category => (
//             <li 
//               key={category.CategoryID} 
//               className="cursor-pointer text-blue-500 hover:underline"
//               onClick={() => onCategorySelect(category.CategoryID)}
//             >
//               {category.CategoryName}
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   }
  
//   export default CategoryList;

import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CategoryList = ({ categories, onCategorySelect }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const handleClick = (categoryId) => {
    const isExpanded = expandedCategory === categoryId;
    setExpandedCategory(isExpanded ? null : categoryId); // Toggle
    onCategorySelect(categoryId); // Always call parent to fetch ingredients
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Select a Category</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li
            key={category.CategoryID}
            className="flex justify-between items-center cursor-pointer text-blue-500 hover:underline"
            onClick={() => handleClick(category.CategoryID)}
          >
            <span>{category.CategoryName}</span>
            <span>{expandedCategory === category.CategoryID ? '-' : '+'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      CategoryID: PropTypes.number.isRequired,
      CategoryName: PropTypes.string.isRequired
    })
  ).isRequired,
  onCategorySelect: PropTypes.func.isRequired
};

export default CategoryList;
