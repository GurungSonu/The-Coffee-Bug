import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", revenue: 12000 },
  { name: "Feb", revenue: 18000 },
  { name: "Mar", revenue: 47000 },
  { name: "Apr", revenue: 25000 },
  { name: "May", revenue: 32000 },
  { name: "Jun", revenue: 47000 },
  { name: "Jul", revenue: 37000 },
  { name: "Aug", revenue: 19000 },
  { name: "Sep", revenue: 27000 },
  { name: "Oct", revenue: 15000 },
];

const RevenueChart = () => {
  return (
    <div className="mt-6 p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-xl font-bold mb-4">Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#3182CE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
