import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import {AdminSidebar} from "../AdminSidebar/AdminSidebar"
 //import AdminNavbar from "../AdminNavbar/AdminNavbar";
import AdminSidebar from "../AdminSidebar/AdminSidebar"
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("working")
        const authData = localStorage.getItem("authData");
        const parsedData = JSON.parse(authData); // Parse stored JSON
        const token = parsedData.token;
        console.log(token);
        // const response = await axios.get("http://localhost:5000/api/categories");
        // const response = await axios.get("http://localhost:5000/api/products/categories");

        const response = await axios.get("http://localhost:5000/api/products/allProducts", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Fetched Categories:", response.data); // Debugging log
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error.response || error);
        // console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.");
      }
    };
  
    fetchProducts();
  }, []);
  

  



  // Handle delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/products/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter((product) => product.ProductID !== id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };

  // Navigate to edit page
  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  return (
    <div className="flex">
    <AdminSidebar/>
      
    <div className="container mx-auto p-6">
      {/* <div className="flex">
      <AdminSidebar/>
      </div> */}
    
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Product List</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Price</th>
            <th className="p-3 border">Category</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.ProductID} className="text-center">

              <td className="p-3 border">{product.ProductName}</td>
              <td className="p-3 border">{product.ProductPrice}Rs</td>

              <td className="p-3 border">{product.ProductCategoryName}</td>
              <td className="p-3 border flex justify-center space-x-4">
                <button
                  onClick={() => handleEdit(product.ProductID)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.ProductID)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => navigate("/admin/products/add")}
        className="mt-6 px-4 py-2 bg-green-500 text-white rounded"
      >
        Add Product
      </button>
    </div>
     </div>
  );
};

export default AdminProducts;
