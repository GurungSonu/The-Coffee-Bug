import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa"; // Import icon for delete
// import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles
import { motion } from "framer-motion"; // For animations

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response.data)
        setUsers(response.data);
        console.log("Stored Token:", localStorage.getItem("token"));

        const authData = JSON.parse(localStorage.getItem("authData"));

        if (authData) {
          // console.log("Stored Token:", authData.token);
          // console.log("Stored Message:", authData.message);
          setMessage(authData.message);
          setToken(authData.token);
          toast.success(message);
          console.log(message);
        } else {
          console.log("No authentication data found.");
        }

      } catch (error) {
        toast.error("Failed to fetch users.", error);
      }
    };

    fetchUsers();
  }, [message, token]);

  // const handleDelete = async (id) => {
  //   try {
  //     console.log(id)
  //     console.log(token)
  //     // const token = localStorage.getItem("token");
  //     await axios.delete(`http://localhost:5000/api/users/deleteUser/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     toast.success("User deleted successfully.");
  //     setUsers(users.filter((user) => user.UserId !== id));
  //   } catch (error) {
  //     toast.error("Failed to delete user.");
  //   }
  // };

  const handleUpdateUserStatus = async (id) => {
    try {
      // Get the token from local storage
      const authData = localStorage.getItem("authData");
        const parsedData = JSON.parse(authData); // Parse stored JSON
        const token = parsedData.token;

              // Log the ID and token for debugging
      console.log("Deleting user with ID:", id);
      console.log("Token:", token); 

      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }



      // Make the DELETE request with Authorization header
      await axios.post(
        `http://localhost:5000/api/users/updateUserStatus/${id}`,
        { action: 'softDelete' }, // or 'deactivate'
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      // Remove the user from the state after successful deletion
      toast.success("User deleted successfully.");
      setUsers(users.filter((user) => user.UserId !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };


  return (
    <div className="container mx-auto p-6 bg-gradient-to-r from-purple-500 to-indigo-600 min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">View All Users</h2>
        <p className="text-xl text-white opacity-80 mt-2">Manage and Delete Users Easily</p>
      </div>

      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-lg">
        <motion.table
          className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <motion.tr
                key={user.UserId}
                className="border-b hover:bg-gray-50 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <td className="px-6 py-4 text-sm text-gray-800">{user.FirstName} {user.LastName}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{user.Email}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{user.Role}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleUpdateUserStatus(user.UserId)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center space-x-2 transition-all hover:bg-red-700"
                  >
                    <FaTrashAlt />
                    <span>Delete</span>
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ViewUsers;
