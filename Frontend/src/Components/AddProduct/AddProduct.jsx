import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productDescription: "",
    productCategoryID: "", // Will be set based on dropdown selection
    productAvailability: "In Stock",
    productQuantity: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]); // Store categories
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("working")
        const authData = localStorage.getItem("authData");
        const parsedData = JSON.parse(authData); // Parse stored JSON
        const token = parsedData.token;
        console.log(token);
        const response = await axios.get("http://localhost:5000/api/products/categories", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Fetched Categories:", response.data); // Debugging log
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error.response || error);
        // console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.");
      }
    };
  
    fetchCategories();
  }, []);
  

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Ensure price & quantity are positive numbers
    if (name === "productPrice" || name === "productQuantity") {
      updatedValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    }

    setFormData({ ...formData, [name]: updatedValue });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, and WEBP images are allowed.");
        return;
      }

      // if (file.size > 2 * 1024 * 1024) {
      //   toast.error("Image size must be less than 2MB.");
      //   return;
      // }

      setImageFile(file);
    }
  };

  // Validate form before submitting
  const validateForm = () => {
    let newErrors = {};

    if (!formData.productName) newErrors.productName = "Product name is required.";
    if (!formData.productCategoryID) newErrors.productCategoryID = "Category is required.";
    if (formData.productPrice === "" || formData.productPrice < 0)
      newErrors.productPrice = "Price cannot be negative or empty.";
    if (!formData.productDescription) newErrors.productDescription = "Product description is required.";
    if (formData.productQuantity === "" || formData.productQuantity < 0)
      newErrors.productQuantity = "Quantity cannot be negative or empty.";
    if (!imageFile) newErrors.image = "Product image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct errors before submitting.");
      return;
    }

    try {
      const authData = localStorage.getItem("authData");
      const parsedData = JSON.parse(authData);
      const token = parsedData?.token;
      console.log(token)
      if (!token) {
        toast.error("Unauthorized! Please log in.");
        return;
      }
      console.log(formData)
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      formDataToSend.append("image", imageFile);
      console.log("Form Data being sent:");
for (let [key, value] of formDataToSend.entries()) {
  console.log(key, value);
}

      // console.log(formDataToSend)
      await axios.post("http://localhost:5000/api/products/create", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Product Name:</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          {errors.productName && <p className="text-red-500">{errors.productName}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Price:</label>
          <input
            type="number"
            name="productPrice"
            value={formData.productPrice}
            onChange={handleChange}
            className="border p-2 w-full"
            min="0"
          />
          {errors.productPrice && <p className="text-red-500">{errors.productPrice}</p>}
        </div>
        <div>
          <label className="block text-gray-700">Product Description:</label>
          <input
            type="text"
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          {errors.productDescription && <p className="text-red-500">{errors.productDescription}</p>}
        </div>
        <div>
          <label className="block text-gray-700">Quantity:</label>
          <input
            type="number"
            name="productQuantity"
            value={formData.productQuantity}
            onChange={handleChange}
            className="border p-2 w-full"
            min="0"
          />
          {errors.productQuantity && <p className="text-red-500">{errors.productQuantity}</p>}
        </div>

        {/* Category Dropdown */}
        <div>
  <label className="block text-gray-700">Category:</label>
  <select
    name="productCategoryID"
    value={formData.productCategoryID}
    onChange={handleChange}
    className="border p-2 w-full"
  >
    <option value="">Select a category</option>
    {categories.length > 0 ? (
      categories.map((category) => (
        <option key={category.ProductCategoryID} value={category.ProductCategoryID}>
          {category.ProductCategoryName}
        </option>
      ))
    ) : (
      <option value="">No categories available</option>
    )}
  </select>
  {errors.productCategoryID && <p className="text-red-500">{errors.productCategoryID}</p>}
</div>



        <div>
          <label className="block text-gray-700">Product Image:</label>
          <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="border p-2 w-full" />
          {errors.image && <p className="text-red-500">{errors.image}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Availability:</label>
          <select
            name="productAvailability"
            value={formData.productAvailability}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
