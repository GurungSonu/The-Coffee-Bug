import React from "react";

const DashboardCards = () => {
  const stats = [
    { title: "Total Menu", value: "345" },
    { title: "Total Revenue", value: "$37,193.00" },
    { title: "Total Customer", value: "1349" },
    { title: "Total Orders", value: "3,500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
      {stats.map((stat, index) => (
        <div key={index} className="p-6 bg-gradient-to-br from-blue-300 to-blue-500 text-white rounded-lg shadow-md">
          <h3 className="text-lg">{stat.title}</h3>
          <p className="text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
