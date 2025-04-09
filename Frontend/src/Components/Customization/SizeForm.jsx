import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

const SizeForm = ({ ingredients = [], onClose, onSizeAdded }) => {
    const [ingredientId, setIngredientId] = useState('');
    const [unit, setUnit] = useState('');
    const [minQuantity, setMinQuantity] = useState('');
    const [stepQuantity, setStepQuantity] = useState('');
    const [pricePerStep, setPricePerStep] = useState('');
    const [error, setError] = useState('');
    const[ingredient, setIngredients] = useState('');

    // Log ingredients on change to check if they are populated correctly
    useEffect(() => {
        console.log(ingredients);  // Log to check ingredients structure
    }, [ingredients]);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("authData"))?.token;

                if (!token) {
                    toast.error("Unauthorized! Please log in.");
                    return;
                }

                const response = await axios.get("http://localhost:5000/api/customize/ingredients", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true  // Ensure cookies are sent
                });

                setIngredients(response.data);
                setIngredients(response.data);  // Set the categories state
                console.log(response.data);  // Log the categories response // Assuming the response contains the categories
            } catch (err) {
                console.error("Error fetching categories:", err);
                toast.error("Failed to load categories.");
            }
        };

        fetchIngredients();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if all fields are filled
        if (!ingredientId || !unit || !minQuantity || !stepQuantity || !pricePerStep) {
            toast.error("All fields are required.");
            return;
        }
    
        // Check for negative values
        if (minQuantity < 0 || stepQuantity < 0 || pricePerStep < 0) {
            toast.error("Quantity and price cannot be negative.");
            return;
        }
    
        try {
            const token = JSON.parse(localStorage.getItem("authData"))?.token;
    
            if (!token) {
                toast.error("Unauthorized! Please log in.");
                return;
            }
    
            // Send request to add size
            const response = await axios.post(
                "http://localhost:5000/api/customize/sizes",
                { ingredientId, unit, minQuantity, stepQuantity, pricePerStep },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true  // Ensure cookies are sent
                }
            );
    
            // If successful, close the modal and notify the parent
            if (response.status === 201) {
                onSizeAdded(response.data); // Notify parent
                onClose; // Close the modal
                toast.success("Size added successfully!");
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error(err.response?.data?.error || 'Something went wrong');
        }
    };
    

    return (
        <div className="modal">
            <h2>Add New Size</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Ingredient</label>
                    <select
                        value={ingredientId}
                        onChange={(e) => setIngredientId(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {ingredient.length > 0 ? (
                            ingredient.map((ingredient, index) => (
                                <option key={ingredient.IngredientID || index} value={ingredient.CategoryID}>
                                    {ingredient.IngredientName}
                                </option>
                            ))
                        ) : (
                            <option disabled>No categories available</option>
                        )}
                    </select>
                </div>
                <div>
                    <label>Unit</label>
                    <input
                        type="text"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                    />
                </div>
                <div>
                    <label>Min Quantity</label>
                    <input
                        type="number"
                        value={minQuantity}
                        onChange={(e) => {
                            const value = Math.max(0, e.target.value); // Prevent negative values
                            setMinQuantity(value);
                        }}
                    />
                </div>
                <div>
                    <label>Step Quantity</label>
                    <input
                        type="number"
                        value={stepQuantity}
                        onChange={(e) => {
                            const value = Math.max(0, e.target.value); // Prevent negative values
                            setStepQuantity(value);
                        }}
                    />
                </div>
                <div>
                    <label>Price per Step</label>
                    <input
                        type="number"
                        value={pricePerStep}
                        onChange={(e) => {
                            const value = Math.max(0, e.target.value); // Prevent negative values
                            setPricePerStep(value);
                        }}
                    />
                </div>
                <button type="submit">Add Size</button>
                <button type="button" onClick={onClose}>Close</button>
            </form>
        </div>
    );
};

// PropTypes validation for the props
SizeForm.propTypes = {
    ingredients: PropTypes.array.isRequired, // Ensure ingredients is an array
    onClose: PropTypes.func.isRequired, // Ensure onClose is a function
    onSizeAdded: PropTypes.func.isRequired, // Ensure onSizeAdded is a function
};

export default SizeForm;
