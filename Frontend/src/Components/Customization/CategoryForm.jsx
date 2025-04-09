/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const CategoryForm = ({ onClose, onCategoryAdded }) => {
    const [categoryName, setCategoryName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryName.trim()) {
            toast.error("Category name is required.");
            return;
        }

        try {
            const token = JSON.parse(localStorage.getItem("authData"))?.token;

            console.log("Token:", token);  // Debugging
            console.log("Sending request:", { categoryName });  // Debugging

            if (!token) {
                toast.error("Unauthorized! Please log in.");
                return;
            }
            console.log("Sending request:", { categoryName });
            console.log("Token:", token);


            const response = await axios.post(
                "http://localhost:5000/api/customize/createCategories",
                { categoryName },
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
                onCategoryAdded(response.data);
                onClose;
                toast.success("Category added successfully!");
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error(err.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className="modal">
            <h2>Add New Category</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Category Name</label>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </div>
                <button type="submit">Add Category</button>
                <button type="button" onClick={onClose}>Close</button>
            </form>
        </div>
    );
};
CategoryForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onCategoryAdded: PropTypes.func.isRequired,
};

export default CategoryForm;
