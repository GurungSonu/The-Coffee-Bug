// import React from "react";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import CreateUser from "./Components/UserRegister/CreateUser";
// import ViewUsers from "./Components/ViewUsers/ViewUsers";
// import Login from "./Components/LoginPage/Login";
// import AdminLogin from "./Components/AdminLogin/AdminLogin";
// import AddProduct from "./Components/AddProduct/AddProduct";
// import AdminProducts from "./Components/AdminProducts/AdminProducts";
// import UserProducts from "./Components/UserProduct/UserProducts";
// import Dashboard from "./Components/Dashboard/Dashboard";
// import Homepage from "./Components/Homepage/Homepage";
// import CustomerNavbar from "./Components/CustomerNavbar/CustomerNavbar"; // Import Navbar
// import { Outlet } from "react-router-dom";
// import MainCart from "./Components/MainCart/MainCart";
// import OrderDetails from "./Components/Order/OrderDetails";
// import ManageIngredient from "./Components/Customization/ManageIngredient";
// import CustomerCustomization from "./Components/CustomerCustomization/CustomerCustomization";
// import OrderList from "./Components/Order/OrderList";
// import Checkout from "./Components/MainCart/CheckOut";



// // Layout Component
// const Layout = () => {
//   return (
//     <div>
//       <CustomerNavbar />
//       <Outlet /> This is where the page content will be loaded
    
//     </div>
//   );
// };

// const App = () => {
//   const isAuthenticated = () => {
//     try {
//       const authData = localStorage.getItem("authData");
//       if (!authData) return false;

//       const parsedData = JSON.parse(authData);
//       const token = parsedData.token;

//       if (!token) return false;

//       const decodedToken = JSON.parse(atob(token.split('.')[1]));
//       return decodedToken.role === "Admin";
//     } catch (error) {
//       console.error("Error in isAuthenticated function:", error);
//       return false;
//     }
//   };

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/adminLogin" element={<AdminLogin/>} />
//         <Route path="/signup" element={<CreateUser />} />

//         {/* Customer Routes with Navbar */}
//         <Route element={<Layout />}>
//           <Route path="/user/products" element={<UserProducts />} />
//           <Route path="/" element={<Homepage />} />
//           <Route path="/mainCart" element={<MainCart/>}/>
//           {/* <Route path="/orderDetail" element={<OrderDetails/>}/> */}
//           <Route path="/orderList" element={<OrderList/>} />
//           <Route path="/customization" element={<CustomerCustomization/>}/>
//           <Route path="/orders/:masterOrderID" element={<OrderDetails />} />
//           <Route path="/checkout" element={<Checkout/>} />
//         </Route>

//         {/* Admin Routes */}
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/manageIngredient" element={<ManageIngredient/>} /> 
//         <Route
//           path="/users"
//           element={isAuthenticated() ? <ViewUsers /> : <Navigate to="/login" />}
//         />
//         <Route path="/createProduct" element={<AddProduct />} />
//         <Route path="/admin/products" element={<AdminProducts />} />

//         <Route path="/login" element={<Login />} /> {/* Default Route */}
//       </Routes>
//     </Router>
    
//   );
// };

// export default App;


import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import CreateUser from "./Components/UserRegister/CreateUser";
import ViewUsers from "./Components/ViewUsers/ViewUsers";
import Login from "./Components/LoginPage/Login";
import AdminLogin from "./Components/AdminLogin/AdminLogin";
import AddProduct from "./Components/AddProduct/AddProduct";
import AdminProducts from "./Components/AdminProducts/AdminProducts";
import UserProducts from "./Components/UserProduct/UserProducts";
import Dashboard from "./Components/Dashboard/Dashboard";
import Homepage from "./Components/Homepage/Homepage";
import CustomerNavbar from "./Components/CustomerNavbar/CustomerNavbar";
import MainCart from "./Components/MainCart/MainCart";
import OrderDetails from "./Components/Order/OrderDetails";
import ManageIngredient from "./Components/Customization/ManageIngredient";
import CustomerCustomization from "./Components/CustomerCustomization/CustomerCustomization";
import OrderList from "./Components/Order/OrderList";
import Checkout from "./Components/MainCart/CheckOut";
import { toast } from "react-toastify";
import KhaltiSuccess from "./Components/KhaltiSuccess/KhaltiSuccess";
import { Home } from "./Components/Homepage/Home";
import CustomerFooter from "./Components/Footer/CustomerFooter";
import AdminOrderManager from "./Components/AdminOrder/AdminOrderManager";


// 🔐 ProtectedRoute wrapper for customer-only pages
const ProtectedRoute = ({ children }) => {
  const authData = JSON.parse(localStorage.getItem("authData"));
  if (!authData?.token) {
    toast.warning("Please login to access this page.");
    return <Navigate to="/login" />;
  }
  return children;
};

// 🌐 Layout with CustomerNavbar
const Layout = () => {
  return (
    <div>
      <CustomerNavbar />
      <Outlet />
      <CustomerFooter/>
    </div>
  );
};

// 🔐 Admin role checker
const isAuthenticated = () => {
  try {
    const authData = localStorage.getItem("authData");
    if (!authData) return false;

    const parsedData = JSON.parse(authData);
    const token = parsedData.token;

    if (!token) return false;

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.role === "Admin";
  } catch (error) {
    console.error("Error in isAuthenticated function:", error);
    return false;
  }
};


const App = () => {
  return (
    <Router>
      <Routes>

        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<CreateUser />} />
        <Route path="/adminLogin" element={<AdminLogin />} />

        {/* Public customer-facing pages */}
        <Route element={<Layout />}>
          {/* <Route path="/" element={<Homepage />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/user/products" element={<UserProducts />} />

          {/* ✅ Protected pages */}
          <Route path="/mainCart" element={<ProtectedRoute><MainCart /></ProtectedRoute>} />
          <Route path="/orderList" element={<ProtectedRoute><OrderList /></ProtectedRoute>} />
          <Route path="/customization" element={<ProtectedRoute><CustomerCustomization /></ProtectedRoute>} />
          <Route path="/orders/:masterOrderID" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/khalti-success" element={<KhaltiSuccess/>}></Route>
        </Route>

        {/* Admin-only pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manageIngredient" element={<ManageIngredient />} />
        <Route path="/createProduct" element={<AddProduct />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrderManager/>} />
        <Route path="/viewUsers" element={<ViewUsers/>} />
        <Route
          path="/users"
          element={isAuthenticated() ? <ViewUsers /> : <Navigate to="/login" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

