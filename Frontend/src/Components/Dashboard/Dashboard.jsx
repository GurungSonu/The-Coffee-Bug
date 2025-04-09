import React from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import DashboardCards from "../DashboardCards/DashboardCards";
import RevenueChart from "../RevenueChart/RevenueChart";

const Dashboard = () => {
  return (
    <div className="flex">
      <AdminSidebar/>
      <div className="flex-1 p-6">
        <AdminNavbar />
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <DashboardCards/>
        <RevenueChart/>
      </div>
    </div>
  );
};

export default Dashboard;
