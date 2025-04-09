// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import CategoryList from './CategoryList';
// import IngredientList from './IngredientList';

// const CustomerCustomization = () => {
//   const [categories, setCategories] = useState([]);
//   const [ingredientsByCategory, setIngredientsByCategory] = useState({});

//   const [order, setOrder] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const token = JSON.parse(localStorage.getItem("authData"))?.token;

//         if (!token) {
//           toast.error("Unauthorized! Please log in.");
//           return;
//         }

//         const response = await axios.get("http://localhost:5000/api/customize/categories", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           },
//           withCredentials: true  // Ensure cookies are sent
//         });

//         setCategories(response.data);
//         setCategories(response.data);  // Set the categories state
//         console.log(response.data);  // Log the categories response // Assuming the response contains the categories
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//         toast.error("Failed to load categories.");
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleCategorySelect = async (categoryId) => {
//     const token = JSON.parse(localStorage.getItem("authData"))?.token;
//     if (!token) {
//       toast.error("Unauthorized! Please log in.");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/customize/customerIngredients?categoryId=${categoryId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           },
//           withCredentials: true
//         }
//       );

//       setIngredientsByCategory((prev) => ({
//         ...prev,
//         [categoryId]: response.data
//       }));
//     } catch (error) {
//       console.error("Error fetching ingredients:", error);
//       toast.error("Failed to load ingredients.");
//     }
//   };



//   const handleIngredientSelect = (ingredientId) => {
//     const token = JSON.parse(localStorage.getItem("authData"))?.token;

//     if (!token) {
//       toast.error("Unauthorized! Please log in.");
//       return;
//     }

//     axios.get(`http://localhost:5000/api/customize/sizes/ingredient/${ingredientId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json"
//       },
//       withCredentials: true
//     })
//       .then(response => {
//         const defaultSize = response.data[0]; // Assume the first size is the default
//         setOrder(prevOrder => [
//           ...prevOrder,
//           { ingredientId, size: defaultSize, price: defaultSize.PricePerStep }
//         ]);
//         setTotalPrice(prevTotal => prevTotal + defaultSize.PricePerStep);
//       })
//       .catch(error => {
//         console.error('Error fetching sizes:', error);
//         toast.error("Failed to fetch ingredient size.");
//       });
//   };


//   const handleAddIngredient = (ingredientId, size) => {
//     const ingredientPrice = size.PricePerStep;
//     setOrder(prevOrder => [
//       ...prevOrder,
//       { ingredientId, size, price: ingredientPrice }
//     ]);
//     setTotalPrice(prevTotal => prevTotal + ingredientPrice);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Customer Ordering</h1>

//       {/* <CategoryList categories={categories} onCategorySelect={setSelectedCategory} />
      
//       {selectedCategory && (
//         <IngredientList 
//           ingredients={ingredients} 
//           onIngredientSelect={handleIngredientSelect} 
//           onAddIngredient={handleAddIngredient}
//         />
//       )} */}
//       <CategoryList categories={categories} onCategorySelect={handleCategorySelect} />

//       <IngredientList
//         ingredientsByCategory={ingredientsByCategory}
//         onAddIngredient={handleAddIngredient}
//       />


//       {order.length > 0 && (
//         <div className="mt-4">
//           <h2 className="text-xl font-semibold">Your Order</h2>
//           <ul>
//             {order.map((item, index) => (
//               <li key={index} className="flex justify-between mb-2">
//                 <span>{ingredients.find(i => i.IngredientID === item.ingredientId).IngredientName} - {item.size.Unit}</span>
//                 <span>${item.price}</span>
//               </li>
//             ))}
//           </ul>
//           <p className="font-bold mt-2">Total: ${totalPrice}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CustomerCustomization;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
// import { FaPlus, FaMinus } from 'react-icons/fa';

const CustomerCustomization = () => {
  const [categories, setCategories] = useState([]);
  const [ingredientsByCategory, setIngredientsByCategory] = useState({});
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("authData"))?.token;
        if (!token) return toast.error("Unauthorized! Please log in.");

        const response = await axios.get("http://localhost:5000/api/customize/categories", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });

        setCategories(response.data);

        // Fetch ingredients for each category
        response.data.forEach(category => fetchIngredients(category.CategoryID));
      } catch (err) {
        toast.error("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  const fetchIngredients = async (categoryId) => {
    try {
      const token = JSON.parse(localStorage.getItem("authData"))?.token;
      if (!token) return toast.error("Unauthorized! Please log in.");

      const response = await axios.get(
        `http://localhost:5000/api/customize/customerIngredients?categoryId=${categoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      setIngredientsByCategory((prev) => ({
        ...prev,
        [categoryId]: response.data
      }));
    } catch (error) {
      toast.error("Failed to load ingredients.");
    }
  };

  const handleSelectIngredient = async (ingredientId) => {
    console.log("heyy");
    const token = JSON.parse(localStorage.getItem("authData"))?.token;
    if (!token) return toast.error("Unauthorized! Please log in.");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/customize/sizes/ingredient/${ingredientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      console.log(response.data);
      const size = response.data[0]; // default size
      const price = size.PricePerStep;

      if (selectedIngredients[ingredientId]) return;

      const updated = {
        ...selectedIngredients,
        [ingredientId]: {
          ingredientId,
          size,
          quantity: 1,
          pricePerStep: price,
        },
      };

      setSelectedIngredients(updated);
      calculateTotal(updated);
    } catch (error) {
      toast.error("Failed to fetch ingredient size.");
    }
  };

  const incrementQuantity = (ingredientId) => {
    const updated = { ...selectedIngredients };
    updated[ingredientId].quantity += 1;
    setSelectedIngredients(updated);
    calculateTotal(updated);
  };

  const decrementQuantity = (ingredientId) => {
    const updated = { ...selectedIngredients };
    if (updated[ingredientId].quantity > 1) {
      updated[ingredientId].quantity -= 1;
    } else {
      delete updated[ingredientId];
    }
    setSelectedIngredients(updated);
    calculateTotal(updated);
  };

  const calculateTotal = (ingredients) => {
    const total = Object.values(ingredients).reduce(
      (acc, item) => acc + item.quantity * item.pricePerStep,
      0
    );
    setTotalPrice(total);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customize Your Drink</h1>

      {categories.map((category) => (
        <div key={category.CategoryID} className="mb-6">
          <label className="block font-semibold mb-1">{category.CategoryName}</label>
          <select
            onChange={(e) => {
              const ingredientId = parseInt(e.target.value);
              console.log(ingredientId);
              if (ingredientId) handleSelectIngredient(ingredientId);
            }}
            className="w-full border p-2 rounded"
            defaultValue=""
          >
            <option value="" disabled>
              Select {category.CategoryName}...
            </option>
            {ingredientsByCategory[category.CategoryID]?.map((ingredient) => (
              <option key={ingredient.IngredientID} value={ingredient.IngredientID}>
                {ingredient.IngredientName}
              </option>
            ))}
          </select>

          {/* Show selected ingredients under each category */}
          {ingredientsByCategory[category.CategoryID]?.map((ingredient) => {
            const selected = selectedIngredients[ingredient.IngredientID];
            if (!selected) return null;

            return (
              <div
                key={ingredient.IngredientID}
                className="mt-2 bg-gray-100 rounded p-3 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{ingredient.IngredientName}</div>
                  <div className="text-sm text-gray-600">
                    Size: {selected.size.Unit} | Price per unit: Rs{selected.pricePerStep}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="bg-blue-500 text-white rounded px-2 py-1"
                    onClick={() => decrementQuantity(ingredient.IngredientID)}
                  >
                    -
                  </button>
                  <span className="font-semibold">{selected.quantity}</span>
                  <button
                    className="bg-green-500 text-white rounded px-2 py-1"
                    onClick={() => incrementQuantity(ingredient.IngredientID)}
                  >
                    +
                  </button>
                  <span className="ml-4 font-semibold">
                    Rs{(selected.quantity * selected.pricePerStep).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {Object.keys(selectedIngredients).length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">Total: Rs{totalPrice.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
};

export default CustomerCustomization;

