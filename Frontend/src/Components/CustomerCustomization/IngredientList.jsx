// /* eslint-disable react/prop-types */
// import React from 'react';

// import { useState } from 'react';
// // import PropTypes from 'prop-types';
// const IngredientList = ({ ingredients, onIngredientSelect, onAddIngredient }) => {
//   const [isOpen, setIsOpen] = useState(true); // toggle dropdown open

//   const [expandedIngredients, setExpandedIngredients] = useState([]);

//   const toggleIngredient = (ingredientId) => {
//     setExpandedIngredients((prevState) => 
//       prevState.includes(ingredientId)
//         ? prevState.filter(id => id !== ingredientId)
//         : [...prevState, ingredientId]
//     );
//   };

//   return (
//     // <div className="mb-4">
//     //   <h2 className="text-xl font-semibold mb-2">Select an Ingredient</h2>
//     //   <ul>
//     //     {ingredients.map(ingredient => (
//     //       <li key={ingredient.IngredientID} className="mb-4">
//     //         <div 
//     //           className="flex justify-between cursor-pointer text-blue-500 hover:underline"
//     //           onClick={() => toggleIngredient(ingredient.IngredientID)}
//     //         >
//     //           <span>{ingredient.IngredientName}</span>
//     //           <span>{expandedIngredients.includes(ingredient.IngredientID) ? '-' : '+'}</span>
//     //         </div>
//     //         {expandedIngredients.includes(ingredient.IngredientID) && (
//     //           <div className="ml-4">
//     //             <button 
//     //               onClick={() => onAddIngredient(ingredient.IngredientID, ingredient.size)} 
//     //               className="text-green-500 hover:underline"
//     //             >
//     //               Add Ingredient
//     //             </button>
//     //           </div>
//     //         )}
//     //       </li>
//     //     ))}
//     //   </ul>
//     // </div>

//     <div className="mb-4">
//       <div className="relative">
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
//         >
//           {isOpen ? 'Hide Ingredients ▲' : 'Show Ingredients ▼'}
//         </button>

//         <div
//           className={`transition-all duration-300 ease-in-out overflow-hidden ${
//             isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
//           }`}
//         >
//           <ul className="mt-4 bg-gray-100 p-4 rounded shadow">
//             {ingredients.map((ingredient) => (
//               <li key={ingredient.IngredientID} className="flex justify-between py-1">
//                 <span>{ingredient.IngredientName}</span>
//                 <button
//                   onClick={() =>
//                     onAddIngredient(ingredient.IngredientID, ingredient.size)
//                   }
//                   className="text-green-600 hover:underline"
//                 >
//                   Add
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default IngredientList;

// import React, { useState } from 'react';
// import PropTypes from 'prop-types';

// const IngredientList = ({ ingredients, onAddIngredient }) => {
//   const [selectedIngredientId, setSelectedIngredientId] = useState('');

//   console.log("Props received by IngredientList:", ingredients);

//   const handleSelectChange = (e) => {
//     setSelectedIngredientId(e.target.value);
//   };

//   const handleAddClick = () => {
//     const selected = ingredients.find(i => i.IngredientID === parseInt(selectedIngredientId));
//     if (selected) {
//       onAddIngredient(selected.IngredientID, selected.size);
//     }
//   };

//   return (
//     <div className="mb-6">
//       <h2 className="text-lg font-semibold mb-2">Choose an Ingredient</h2>

//       <div className="flex gap-4 items-center">
//         <select
//           value={selectedIngredientId}
//           onChange={handleSelectChange}
//           className="p-2 border rounded shadow"
//         >
//           <option value="" disabled>Select an ingredient</option>
//           {ingredients.map(ingredient => (
//             <option key={ingredient.IngredientID} value={ingredient.IngredientID}>
//               {ingredient.IngredientName}
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={handleAddClick}
//           disabled={!selectedIngredientId}
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
//         >
//           Add
//         </button>
//       </div>
//     </div>
//   );
// };

// IngredientList.propTypes = {
//   ingredients: PropTypes.arrayOf(
//     PropTypes.shape({
//       IngredientID: PropTypes.number.isRequired,
//       IngredientName: PropTypes.string.isRequired,
//       size: PropTypes.shape({
//         Unit: PropTypes.string,
//         PricePerStep: PropTypes.number
//       })
//     })
//   ).isRequired,
//   onAddIngredient: PropTypes.func.isRequired
// };

// export default IngredientList;

import React, { useState } from 'react';
import PropTypes from 'prop-types';

const IngredientList = ({ ingredientsByCategory, onAddIngredient }) => {
  const [expandedCategories, setExpandedCategories] = useState([]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div>
      {Object.entries(ingredientsByCategory).map(([categoryId, ingredients]) => (
        <div key={categoryId} className="mb-4">
          <div
            onClick={() => toggleCategory(categoryId)}
            className="flex justify-between cursor-pointer font-semibold text-blue-500 hover:underline"
          >
            <span>Category {categoryId}</span>
            <span>{expandedCategories.includes(categoryId) ? '-' : '+'}</span>
          </div>

          {expandedCategories.includes(categoryId) && (
            <ul className="ml-4 mt-2 space-y-1">
              {ingredients.map((ingredient) => (
                <li key={ingredient.IngredientID} className="flex justify-between">
                  <span>{ingredient.IngredientName}</span>
                  <button
                    onClick={() =>
                      onAddIngredient(ingredient.IngredientID, ingredient.size)
                    }
                    className="text-green-600 hover:underline"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

IngredientList.propTypes = {
  ingredientsByCategory: PropTypes.object.isRequired,
  onAddIngredient: PropTypes.func.isRequired,
};

export default IngredientList;

