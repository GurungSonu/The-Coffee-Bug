import React from "react";

const AdminNavbar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg">
      <input type="text" placeholder="Search" className="border p-2 rounded-lg w-64" />
      <div className="flex items-center gap-2">
        <span className="font-bold">Sonu Gurung</span>
        <div className="w-10 h-10 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export default AdminNavbar;
