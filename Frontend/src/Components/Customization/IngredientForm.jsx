import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

const IngredientForm = ({ onClose, onIngredientAdded }) => {
    const [ingredientName, setIngredientName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);  // State to store the fetched categories
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("authData"))?.token;
    
                if (!token) {
                    toast.error("Unauthorized! Please log in.");
                    return;
                }
    
                const response = await axios.get("http://localhost:5000/api/customize/categories", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true  // Ensure cookies are sent
                });
    
                setCategories(response.data); 
                setCategories(response.data);  // Set the categories state
                 console.log(response.data);  // Log the categories response // Assuming the response contains the categories
            } catch (err) {
                console.error("Error fetching categories:", err);
                toast.error("Failed to load categories.");
            }
        };
    
        fetchCategories();
    }, []);  // Empty dependency array ensures this runs only once when the component mounts
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form inputs
        if (!ingredientName.trim()) {
            toast.error("Ingredient name is required.");
            return;
        }
        if (!categoryId) {
            toast.error("Category is required.");
            return;
        }

        try {
            const token = JSON.parse(localStorage.getItem("authData"))?.token;

            console.log("Token:", token);  // Debugging
            console.log("Sending request:", { categoryId, ingredientName });  // Debugging

            if (!token) {
                toast.error("Unauthorized! Please log in.");
                return;
            }

            // Send request to backend
            const response = await axios.post(
                "http://localhost:5000/api/customize/ingredients",  // Endpoint for ingredients
                { categoryId, ingredientName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true  // Ensure cookies are sent
                }
            );

            console.log("Full Request Sent:", response.config);
            console.log("Headers Sent:", response.config.headers);
            console.log("Body Sent:", response.config.data);

            if (response.status === 201) {
                onIngredientAdded(response.data);  // Notify parent about the new ingredient
                onClose;  // Close the modal after successful submission
                toast.success("Ingredient added successfully!");  // Notify the user
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error(err.response?.data?.error || "Something went wrong");  // Show error message
        }
    };

    return (
        <div className="modal">
            <h2>Add New Ingredient</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Ingredient Name</label>
                    <input
                        type="text"
                        value={ingredientName}
                        onChange={(e) => setIngredientName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Category</label>
                    <select
    value={categoryId}
    onChange={(e) => setCategoryId(e.target.value)}
>
    <option value="">Select Category</option>
    {categories.length > 0 ? (
        categories.map((category, index) => (
            <option key={category.CategoryID || index} value={category.CategoryID}>
                {category.CategoryName}
            </option>
        ))
    ) : (
        <option disabled>No categories available</option>
    )}
</select>


                </div>
                <button type="submit">Add Ingredient</button>
                <button type="button" onClick={onClose}>Close</button>
            </form>
        </div>
    );
};

IngredientForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onIngredientAdded: PropTypes.func.isRequired,
};

export default IngredientForm;
