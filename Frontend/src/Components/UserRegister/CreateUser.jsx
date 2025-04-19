import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiUser, FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
  });

  const [errors, setErrors] = useState({});

  // Regex for validations
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  const phoneRegex = /^[9][0-9]{9}$/;

  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      if (!value) error = "Email is required";
      else if (!value.includes("@")) error = "Invalid email format";
    }

    if (name === "password") {
      if (!value) error = "Password is required";
      else if (!passwordRegex.test(value))
        error =
          "Must be 6+ chars, include uppercase, number, and special char.";
    }

    if (name === "phoneNumber") {
      if (!value) error = "Phone number is required";
      else if (!phoneRegex.test(value))
        error = "Invalid Nepali number format (start with 9...)";
    }

    if (!value && name !== "address") {
      error = `${name} is required`;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  
    // Live check only if input is valid length
    if ((name === "email" && value.includes("@")) || (name === "phoneNumber" && value.length >= 10)) {
      try {
        const res = await axios.get("http://localhost:5000/api/users/check-availability", {
          params: {
            email: name === "email" ? value : "",
            phoneNumber: name === "phoneNumber" ? value : ""
          }
        });
        setErrors((prev) => ({ ...prev, [name]: "" })); // ✅ Clear error if available
      } catch (err) {
        if (err.response?.data?.field === name) {
          setErrors((prev) => ({
            ...prev,
            [name]: err.response.data.message
          }));
        }
      }
    }
  };
  
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, or WEBP files are allowed.");
      return;
    }

    setImageFile(file);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Check all fields before submit
  //   let hasError = false;
  //   Object.keys(formData).forEach((field) => {
  //     validateField(field, formData[field]);
  //     if (!formData[field] && field !== "address") hasError = true;
  //   });

  //   if (hasError) {
  //     toast.error("Please fix the errors and try again.");
  //     return;
  //   }

  //   const formDataToSend = new FormData();
  //   Object.keys(formData).forEach((key) => {
  //     formDataToSend.append(key, formData[key]);
  //   });

  //   if (imageFile) {
  //     formDataToSend.append("profileImage", imageFile);
  //   }

  //   try {
  //     await axios.post("http://localhost:5000/api/users/createUser", formDataToSend, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     toast.success("✅ Registration successful!");
  //     setTimeout(() => {
  //       navigate("/login");
  //     }, 2000);
  //   } catch (error) {
  //     console.error("❌ Registration error:", error.response?.data);
  //     toast.error(error.response?.data?.message || "Registration failed");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate all fields
    let hasError = false;
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
      if (!formData[field] && field !== "address") hasError = true;
    });
  
    if (hasError) {
      toast.error("Please fix the errors and try again.");
      return;
    }
  
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
  
    if (imageFile) {
      formDataToSend.append("profileImage", imageFile);
    }
  
    try {
      await axios.post("http://localhost:5000/api/users/createUser", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      // ✅ Show success toast
      toast.success("✅ Registered successfully!");
  
      // ✅ Reset form and image
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        gender: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
      });
      setImageFile(null);
      setErrors({});
  
      // ✅ Redirect after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("❌ Registration error:", error.response?.data);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };
  
  return (
    <div className="flex h-screen">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-12 py-8">
        <img src="/img/Logo.png" alt="Logo" className="w-28 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800">Get Started Now</h2>

        <div className="flex flex-col items-center mt-4">
          <label htmlFor="imageUpload" className="cursor-pointer">
            <div className="w-20 h-20 border rounded-full bg-gray-200 flex justify-center items-center overflow-hidden">
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="text-gray-500 text-4xl" />
              )}
            </div>
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="imageUpload" className="mt-2 text-sm text-blue-600 cursor-pointer">
            <FiUpload className="inline" /> Upload your Photo
          </label>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-lg mt-6 space-y-4">
          <div className="flex space-x-4">
            <div className="w-full">
              <input
                name="firstName"
                placeholder="First Name"
                className="input-style"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>
            <div className="w-full">
              <input
                name="lastName"
                placeholder="Last Name"
                className="input-style"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-full">
              <input
                name="dateOfBirth"
                type="date"
                className="input-style"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
              {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
            </div>
            <div className="w-full">
              <input
                name="phoneNumber"
                placeholder="Phone Number"
                className="input-style"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-full">
              <input
                name="gender"
                placeholder="Gender"
                className="input-style"
                value={formData.gender}
                onChange={handleChange}
              />
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </div>
          </div>

          <input
            name="address"
            placeholder="Address"
            className="input-style"
            value={formData.address}
            onChange={handleChange}
          />

          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="input-style"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="input-style"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="flex items-center">
            <input type="checkbox" className="mr-2" required />
            <span className="text-sm text-gray-600">I agree to the terms & policies</span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Signup
          </button>

          <p className="text-center text-gray-500 mt-2">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-semibold hover:underline">
              Sign In
            </a>
          </p>
        </form>
      </div>

      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/img/Signup.png')" }}
      ></div>
    </div>
  );
};

export default CreateUser;
