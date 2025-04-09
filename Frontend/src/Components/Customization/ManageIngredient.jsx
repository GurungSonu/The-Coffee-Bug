// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// export default function ManageIngredient() {
//   const [isIngredientOpen, setIngredientOpen] = useState(false);
//   const [selectedIngredient, setSelectedIngredient] = useState(null);
//   const [ingredientName, setIngredientName] = useState("");
//   const [ingredientSizes, setIngredientSizes] = useState([]);
//   const [ingredients, setIngredients] = useState([]);
//   const [error, setError] = useState('');
//   const [isAddCategoryOpen, setAddCategoryOpen] = useState(false);  // Add category modal state
//   const [isAddIngredientOpen, setAddIngredientOpen] = useState(false);  // Add ingredient modal state
//   const [categoryName, setCategoryName] = useState('');
//   const [categories, setCategories] = useState('');
//   const [categoryId, setCategoryId] = useState('');


//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [unit, setUnit] = useState("");

//   const [ingredientID, setIngredientID] = useState(null);
//   const [sizeAmount, setSizeAmount] = useState("");
//   const [sizePrice, setSizePrice] = useState("");
//   const [isSizeModalOpen, setSizeModalOpen] = useState(false);
//   const [newCategoryName, setNewCategoryName] = useState("");




//   // Fetch ingredients from the backend
//   useEffect(() => {
//     const fetchIngredients = async () => {
//       try {
//         const authData = localStorage.getItem("authData");
//         if (!authData) {
//           console.error("No token found in localStorage");
//           return;
//         }

//         const parsedData = JSON.parse(authData); // Parse stored JSON
//         const token = parsedData.token;

//         if (!token) {
//           console.error("No token found after parsing");
//           return;
//         }

//         const response = await axios.get("http://localhost:5000/api/customize/ingredients", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         console.log("Fetched Ingredients:", response.data);
//         setIngredients(response.data);
//       } catch (error) {
//         console.error("Error fetching ingredients:", error);
//         toast.error("Failed to load ingredients.");
//       }
//     };

//     fetchIngredients();

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



//   // Handle the edit ingredient (open modal)
//   const handleEditIngredient = (ingredient) => {
//     setSelectedIngredient(ingredient);
//     setIngredientName(ingredient.IngredientName);
//     setIngredientSizes(ingredient.sizes || []);
//     setIngredientOpen(true);
//   };

//   // Handle ingredient and size update
//   const handleUpdateIngredient = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (!ingredientName || ingredientSizes.length === 0) {
//       setError("Ingredient name and sizes are required.");
//       return;
//     }

//     const authData = localStorage.getItem("authData");
//     if (!authData) {
//       setError("You are not logged in.");
//       return;
//     }

//     const parsedData = JSON.parse(authData);
//     const token = parsedData.token;

//     if (!token) {
//       setError("Unauthorized! Please log in.");
//       return;
//     }

//     try {
//       const response = await axios.put(
//         `http://localhost:5000/api/customize/ingredients/${selectedIngredient.IngredientID}`,
//         { ingredientName, sizes: ingredientSizes },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.status === 200) {
//         // Update the ingredient and sizes in state
//         const updatedIngredient = { ...selectedIngredient, IngredientName: ingredientName, sizes: ingredientSizes };
//         setIngredients((prevIngredients) =>
//           prevIngredients.map((ingredient) =>
//             ingredient.IngredientID === updatedIngredient.IngredientID ? updatedIngredient : ingredient
//           )
//         );

//         setIngredientOpen(false); // Close modal
//         setIngredientName(""); // Reset ingredient name
//         setIngredientSizes([]); // Reset sizes
//         toast.success("Ingredient and sizes updated successfully.");
//       }
//     } catch (error) {
//       console.error("Error updating ingredient:", error);
//       toast.error("Failed to update ingredient.");
//     }
//   };

//   // Delete ingredient API call
//   const handleDeleteIngredient = (id) => {
//     const authData = localStorage.getItem("authData");
//     if (!authData) {
//       toast.error("You are not logged in.");
//       return;
//     }

//     const parsedData = JSON.parse(authData);
//     const token = parsedData.token;

//     if (!token) {
//       toast.error("Unauthorized! Please log in.");
//       return;
//     }

//     axios
//       .delete(`http://localhost:5000/api/customize/ingredients/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         setIngredients(ingredients.filter((ingredient) => ingredient.IngredientID !== id));
//         toast.success("Ingredient deleted successfully.");
//       })
//       .catch((error) => {
//         console.error("There was an error deleting the ingredient!", error);
//         toast.error("Failed to delete ingredient.");
//       });
//   };

//   // Add Category Function
//   const handleAddCategory = async (e) => {
//     e.preventDefault();

//     if (!newCategoryName.trim()) {
//       toast.error("Please enter a category name.");
//       return;
//     }

//     try {
//       const token = JSON.parse(localStorage.getItem("authData"))?.token;

//       if (!token) {
//         toast.error("Unauthorized! Please log in.");
//         return;
//       }

//       const response = await axios.post(
//         "http://localhost:5000/api/customize/createCategory",
//         { categoryName: newCategoryName },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           },
//           withCredentials: true
//         }
//       );

//       if (response.status === 201) {
//         setCategories([...categories, response.data]);
//         setNewCategoryName("");
//         setAddCategoryOpen(false);
//         toast.success("Category added successfully!");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Error adding category.");
//       console.error(err);
//     }
//   };



//   const handleAddIngredient = async (e) => {
//     e.preventDefault();

//     if (!ingredientName.trim() || !selectedCategory || !unit) {
//       toast.error("Please fill all fields.");
//       return;
//     }

//     try {
//       const token = JSON.parse(localStorage.getItem("authData"))?.token;

//       if (!token) {
//         toast.error("Unauthorized! Please log in.");
//         return;
//       }

//       const response = await axios.post(
//         "http://localhost:5000/api/customize/createIngredient",
//         {
//           ingredientName,
//           categoryID: selectedCategory,
//           unit
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           },
//           withCredentials: true
//         }
//       );

//       if (response.status === 201) {
//         setIngredients([...ingredients, response.data]);
//         setIngredientName("");
//         setSelectedCategory("");
//         setUnit("");
//         setAddIngredientOpen(false);
//         setIngredientID(response.data.IngredientID);
//         setSizeModalOpen(true);
//         toast.success("Ingredient added! Now add size details.");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Error adding ingredient.");
//       console.log(err);
//     }
//   };



//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

//       {/* Buttons to add category and ingredient */}
//       <div className="flex mb-6 space-x-4">
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           onClick={() => setAddCategoryOpen(true)} // Open the category modal
//         >
//           Add Category
//         </button>
//         {/* <button
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           onClick={() => setAddCategoryOpen(true)}
//         >
//           Add New Category
//         </button> */}


//         <button
//           className="bg-green-500 text-white px-4 py-2 rounded"
//           onClick={() => setAddIngredientOpen(true)} // Open the ingredient modal
//         >
//           Add Ingredient
//         </button>
//       </div>

//       <div className="mt-6">
//         <h2 className="text-xl font-semibold">Ingredients List</h2>
//         <table className="min-w-full mt-4">
//           <thead>
//             <tr>
//               <th className="border px-4 py-2">Ingredient Name</th>
//               <th className="border px-4 py-2">Category</th>
//               <th className="border px-4 py-2">Available</th>
//               <th className="border px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {ingredients.map((ingredient) => (
//               <tr key={ingredient.IngredientID}>
//                 <td className="border px-4 py-2">{ingredient.IngredientName}</td>
//                 <td className="border px-4 py-2">{ingredient.CategoryName}</td>
//                 <td className="border px-4 py-2">{ingredient.Available}</td>
//                 <td className="border px-4 py-2">
//                   <button
//                     className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
//                     onClick={() => handleEditIngredient(ingredient)} // Open edit modal
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="bg-red-500 text-white px-4 py-2 rounded"
//                     onClick={() => handleDeleteIngredient(ingredient.IngredientID)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add Category Modal */}

//       {isAddCategoryOpen && (
//         <div className="fixed inset-0 flex justify-center items-center z-50">
//           <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
//             <h2 className="text-xl font-semibold mb-4">Add Category</h2>
//             <form onSubmit={handleAddCategory}>
//               <div className="mb-4">
//                 <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
//                   Category Name
//                 </label>
//                 <input
//                   type="text"
//                   id="categoryName"
//                   className="w-full px-4 py-2 border rounded-md"
//                   required
//                 />
//               </div>

//               <div className="mt-6 flex justify-between">
//                 <button
//                   type="button"
//                   className="bg-gray-500 text-white px-4 py-2 rounded"
//                   onClick={() => setAddCategoryOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded"
//                 >
//                   Add Category
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Add Ingredient Modal */}
//       {isAddIngredientOpen && (
//         <div className="fixed inset-0 flex justify-center items-center z-50">
//           <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
//             <h2 className="text-xl font-semibold mb-4">Add Ingredient</h2>
//             <form onSubmit={handleAddIngredient}>
//               <div className="mb-4">
//                 <label htmlFor="ingredientName" className="block text-sm font-medium text-gray-700">
//                   Ingredient Name
//                 </label>
//                 <input
//                   type="text"
//                   id="ingredientName"
//                   className="w-full px-4 py-2 border rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label>Category</label>
//                 <select
//                   value={categoryId}
//                   onChange={(e) => setCategoryId(e.target.value)}
//                 >
//                   <option value="">Select Category</option>
//                   {categories.length > 0 ? (
//                     categories.map((category, index) => (
//                       <option key={category.CategoryID || index} value={category.CategoryID}>
//                         {category.CategoryName}
//                       </option>
//                     ))
//                   ) : (
//                     <option disabled>No categories available</option>
//                   )}
//                 </select>


//               </div>


//               <div className="mt-6 flex justify-between">
//                 <button
//                   type="button"
//                   className="bg-gray-500 text-white px-4 py-2 rounded"
//                   onClick={() => setAddIngredientOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded"
//                 >
//                   Add Ingredient
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}



//       {/* Add/Edit Ingredient Modal */}
//       {isIngredientOpen && selectedIngredient && (
//         <div className="fixed inset-0 flex justify-center items-center z-50">
//           <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
//             <h2 className="text-xl font-semibold mb-4">Edit Ingredient</h2>
//             <form onSubmit={handleUpdateIngredient}>
//               <div className="mb-4">
//                 <label htmlFor="ingredientName" className="block text-sm font-medium text-gray-700">
//                   Ingredient Name
//                 </label>
//                 <input
//                   type="text"
//                   id="ingredientName"
//                   value={ingredientName}
//                   onChange={(e) => setIngredientName(e.target.value)}
//                   className="w-full px-4 py-2 border rounded-md"
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label htmlFor="ingredientSizes" className="block text-sm font-medium text-gray-700">
//                   Sizes
//                 </label>
//                 <input
//                   type="text"
//                   id="ingredientSizes"
//                   value={ingredientSizes.join(", ")}
//                   onChange={(e) => setIngredientSizes(e.target.value.split(",").map((size) => size.trim()))}
//                   className="w-full px-4 py-2 border rounded-md"
//                   required
//                 />
//                 <p className="text-sm text-gray-500 mt-1">Enter sizes separated by commas.</p>
//               </div>

//               {error && <p className="text-red-500 text-sm">{error}</p>}

//               <div className="mt-6 flex justify-between">
//                 <button
//                   type="button"
//                   className="bg-gray-500 text-white px-4 py-2 rounded"
//                   onClick={() => setIngredientOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded"
//                 >
//                   Update Ingredient
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


//tyo paila ko manageingredient
import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoryForm from "./CategoryForm";
import IngredientForm from "./IngredientForm";
import SizeForm from "./SizeForm";
import { toast } from "react-toastify";
import AdminSidebar from "../AdminSidebar/AdminSidebar";

export default function ManageIngredient() {
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [isIngredientOpen, setIngredientOpen] = useState(false);
  const [isSizeOpen, setSizeOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [error, setError] = useState('');
  const [ingredientName, setIngredientName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
const [categories, setCategories] = useState([]);

  // const[categoryId, setCategoryId] = useState(''); 
  const[categoryName, setCategoryName] = useState('');
  const [ingredientSizes, setIngredientSizes] = useState([
    {  unit: '', minQty: '', stepQty: '', pricePerStep: '' }
  ]);
  
  
  

  // Fetch ingredients from the backend
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const authData = localStorage.getItem("authData");
        if (!authData) {
          console.error("No token found in localStorage");
          return;
        }

        const parsedData = JSON.parse(authData); // Parse stored JSON
        const token = parsedData.token;

        if (!token) {
          console.error("No token found after parsing");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/customize/ingredients", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched Ingredients:", response.data);
        setIngredients(response.data);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
        toast.error("Failed to load ingredients.");
      }
    };

    fetchIngredients();
  }, []);

  // / Handle the update of the ingredient
  const handleUpdateIngredient = async (e) => {
    e.preventDefault();

    // Check for missing fields
    if (!ingredientName || !categoryName) {  // Now checking for categoryName
      setError("All fields are required.");
      return;
    }

    const authData = localStorage.getItem("authData");
    if (!authData) {
      setError("You are not logged in.");
      return;
    }

    const parsedData = JSON.parse(authData);
    const token = parsedData.token;

    if (!token) {
      setError("Unauthorized! Please log in.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/customize/ingredients/${selectedIngredient.IngredientID}`,  // ID for updating
        { ingredientName, categoryName },  // Pass categoryName instead of categoryId
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // Update the ingredient list with the updated ingredient
        const updatedIngredients = ingredients.map((ingredient) =>
          ingredient.IngredientID === selectedIngredient.IngredientID
            ? { ...ingredient, IngredientName: ingredientName, CategoryName: categoryName }  // Update CategoryName
            : ingredient
        );
        setIngredients(updatedIngredients);
        setSelectedIngredient(null); // Reset selected ingredient
        setIngredientName(""); // Reset ingredient name field
        setCategoryName(""); // Reset category name field
      }
    } catch (error) {
      setError("Failed to update ingredient.");
      console.error("Error updating ingredient:", error);
    }
  }; 

  const handleEditIngredient = (ingredient) => {
     handleSelectIngredient(ingredient.IngredientID)
     console.log(ingredientSizes)
         setSelectedIngredient(ingredient); 
         console.log(ingredient)
        setIngredientName(ingredient.IngredientName);
        setIngredientSizes(ingredient.sizes || []);
        setIngredientOpen(true);
       };

  // Delete ingredient API call
  const handleDeleteIngredient = (id) => {
    const authData = localStorage.getItem("authData");
    if (!authData) {
      toast.error("You are not logged in.");
      return;
    }
  
    const parsedData = JSON.parse(authData);
    const token = parsedData.token;
  
    if (!token) {
      toast.error("Unauthorized! Please log in.");
      return;
    }
  
    axios
      .delete(`http://localhost:5000/api/customize/ingredients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Remove the deleted ingredient from the list
        setIngredients(ingredients.filter((ingredient) => ingredient.IngredientID !== id));
        toast.success("Ingredient deleted successfully.");
      })
      .catch((error) => {
        console.error("There was an error deleting the ingredient!", error);
        toast.error("Failed to delete ingredient.");
      });
  };
  

  useEffect(() => {
    const fetchCategories = async () => {
      const token = JSON.parse(localStorage.getItem("authData"))?.token;
      if (!token) return;
  
      try {
        const res = await axios.get("http://localhost:5000/api/customize/categories", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(res.data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
  
    fetchCategories();
  }, []);
  const handleSelectIngredient = async (ingredientId) => {
    console.log("Fetching sizes for ingredient:", ingredientId);
  
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
  
      const sizes = response.data;
  
      if (!sizes || sizes.length === 0) {
        toast.warning("No sizes found for this ingredient.");
        return;
      }
  
      // Transform and update the state
      const formattedSizes = sizes.map((size) => ({
        unit: size.Unit || '',
        minQty: size.MinQuantity || '',
        stepQty: size.StepQuantity || '',
        pricePerStep: size.PricePerStep || '',
      }));
  
      setIngredientSizes(formattedSizes);
  
    } catch (error) {
      console.error("Error fetching sizes:", error);
      toast.error("Failed to fetch ingredient sizes.");
    }
  };
  
  

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar />
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Ingredient </h1>
      <div className="space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setCategoryOpen(true)}
        >
          Add New Category
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setIngredientOpen(true)}
        >
          Add New Ingredient
        </button>
        
      </div>

      <div className="mt-6">
  <h2 className="text-xl font-semibold">Ingredients List</h2>
  <table className="min-w-full mt-4">
    <thead>
      <tr>
        <th className="border px-4 py-2">Ingredient Name</th>
        <th className="border px-4 py-2">Category</th>
        <th className="border px-4 py-2">Available</th>
        <th className="border px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {ingredients.map((ingredient) => (
        <tr key={ingredient.IngredientID}>
          <td className="border px-4 py-2">{ingredient.IngredientName}</td>
          <td className="border px-4 py-2">{ingredient.CategoryName}</td>
          <td className="border px-4 py-2">{ingredient.Available===1?"Yes":"No"}</td>
          <td className="border px-4 py-2">
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => handleEditIngredient(ingredient)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => handleDeleteIngredient(ingredient.IngredientID)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {isCategoryOpen && (
        <CategoryForm
        onClose={() => setCategoryOpen(false)}
          onCategoryAdded={(category) => {
            setSelectedCategory(category);
            setCategoryOpen(false);
            setIngredientOpen(true);
          }}
        />
      )}

      {isIngredientOpen && (
        <IngredientForm
          close={() => setIngredientOpen(false)}
          category={selectedCategory}
          onIngredientAdded={(ingredient) => {
            setIngredients([...ingredients, ingredient]);
            setSelectedIngredient(ingredient);
            setIngredientOpen(false);
            setSizeOpen(true);
          }}
          ingredient={selectedIngredient}  // Pass selected ingredient if editing
        />
      )}

{isSizeOpen && (
  <SizeForm
    close={() => setSizeOpen(false)}
    onSizeAdded={(size) => {
      // Update the ingredient with a new size
      const updatedIngredients = ingredients.map((ingredient) => {
        if (ingredient.IngredientID === selectedIngredient.IngredientID) {
          // Ensure sizes is an array, even if it's undefined
          const updatedSizes = Array.isArray(ingredient.sizes) ? [...ingredient.sizes, size] : [size];
          return { ...ingredient, sizes: updatedSizes };
        }
        return ingredient;
      });

      setIngredients(updatedIngredients); // Update the state with the new size
      setSizeOpen(false);
    }}
    ingredient={selectedIngredient}
  />
)}

{isIngredientOpen && selectedIngredient && (
  <div className="fixed inset-0 flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
      <h2 className="text-xl font-semibold mb-4">Edit Ingredient</h2>
      <form onSubmit={handleUpdateIngredient}>
        
        {/* Ingredient Name */}
        <div className="mb-4">
          <label htmlFor="ingredientName" className="block text-sm font-medium text-gray-700">
            Ingredient Name
          </label>
          <input
            type="text"
            id="ingredientName"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Category Dropdown */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.CategoryID} value={cat.CategoryID}>
                {cat.CategoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Ingredient Sizes */}
        <div className="mb-4">
  <label htmlFor="ingredientSizes" className="block text-sm font-medium text-gray-700">
    Unit
  </label>
  {ingredientSizes.map((size, index) => (
    <input
      key={index}
      type="text"
      placeholder="Unit"
      value={size.unit}
      onChange={(e) => {
        const updatedSizes = [...ingredientSizes];
        updatedSizes[index].unit = e.target.value;
        setIngredientSizes(updatedSizes);
      }}
      className="w-full px-4 py-2 border rounded-md"
      required
    />
  ))}
  <p className="text-sm text-gray-500 mt-1">Enter price per step for each size.</p>
</div>


        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="mb-4">
  <label htmlFor="ingredientSizes" className="block text-sm font-medium text-gray-700">
    Minimum Quantity
  </label>
  {ingredientSizes.map((size, index) => (
    <input
      key={index}
      type="number"
      placeholder="Minimum Quantity"
      value={size.minQty}
      onChange={(e) => {
        const updatedSizes = [...ingredientSizes];
        updatedSizes[index].minQty = e.target.value;
        setIngredientSizes(updatedSizes);
      }}
      className="w-full px-4 py-2 border rounded-md"
      required
    />
  ))}
  <p className="text-sm text-gray-500 mt-1">Enter price per step for each size.</p>
</div>


        {error && <p className="text-red-500 text-sm">{error}</p>} 

        <div className="mb-4">
  <label htmlFor="ingredientSizes" className="block text-sm font-medium text-gray-700">
    Step Quantity
  </label>
  {ingredientSizes.map((size, index) => (
    <input
      key={index}
      type="number"
      step="0.01"
      placeholder="Step quantity"
      value={size.stepQty}
      onChange={(e) => {
        const updatedSizes = [...ingredientSizes];
        updatedSizes[index].stepQty = e.target.value;
        setIngredientSizes(updatedSizes);
      }}
      className="w-full px-4 py-2 border rounded-md"
      required
    />
  ))}
  <p className="text-sm text-gray-500 mt-1">Enter price per step for each size.</p>
</div>


        {error && <p className="text-red-500 text-sm">{error}</p>}   

        <div className="mb-4">
  <label htmlFor="ingredientSizes" className="block text-sm font-medium text-gray-700">
    Price per Step
  </label>
  {ingredientSizes.map((size, index) => (
    <input
      key={index}
      type="number"
      step="0.01"
      placeholder="Price per step"
      value={size.pricePerStep}
      onChange={(e) => {
        const updatedSizes = [...ingredientSizes];
        updatedSizes[index].pricePerStep = e.target.value;
        setIngredientSizes(updatedSizes);
      }}
      className="w-full px-4 py-2 border rounded-md"
      required
    />
  ))}
  <p className="text-sm text-gray-500 mt-1">Enter price per step for each size.</p>
</div>


        {error && <p className="text-red-500 text-sm">{error}</p>}
        {/* Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setIngredientOpen(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update Ingredient
          </button>
        </div>
      </form>
    </div>
  </div>
)}


    </div>
    </div>
  );
}
